app.controller('MainController', ['$scope', '$rootScope', 'Restangular', 'PubNub',
  function($scope, $rootScope, Restangular, PubNub){
    PubNub.init({
      publish_key:'pub-c-723e6af6-05bd-4d9c-957b-9ecc8fb3f32d',
      subscribe_key:'sub-c-4e07d514-9c8d-11e5-9a49-02ee2ddab7fe',
      uuid: '1'
    });

    $rootScope.allVideos = Restangular.all('videos').getList().$object;
    $rootScope.playVideo = Restangular.one('videos').one('play').get().$object;
    $rootScope.newVideo = { url: '' };

    PubNub.ngSubscribe({
      channel: 'playlist',
      callback: function(video_id, payload){
        Restangular.one('videos', video_id).get().then(function(video){
          $rootScope.allVideos.push(video)
        }, function(err){
          console.log('not found')
        })
      }
    })

    $rootScope.$on('youtube.player.ended', function(event, player){
      var updateVideo = $rootScope.playVideo.put()

      $rootScope.playVideo = updateVideo.$object;

      player.playVideo();
    })
  }
])
