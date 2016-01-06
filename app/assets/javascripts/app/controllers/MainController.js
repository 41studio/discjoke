app.controller('MainController', ['$scope', '$rootScope', 'Restangular', 'PubNub',
  function($scope, $rootScope, Restangular, PubNub){
    PubNub.init({
      publish_key:'pub-c-723e6af6-05bd-4d9c-957b-9ecc8fb3f32d',
      subscribe_key:'sub-c-4e07d514-9c8d-11e5-9a49-02ee2ddab7fe',
      uuid: '1'
    });

    $scope.allVideos = Restangular.all('videos').getList().$object;

    if (window.location.hostname == 'localhost') {
      $scope.playVideo = Restangular.one('videos').one('play').get().$object;

      $scope.$on('youtube.player.ended', function(event, player){
        var updateVideo = $scope.playVideo.put()

        $scope.playVideo = updateVideo.$object;

        PubNub.ngPublish({
          channel: 'nowplaying',
          message: true
        })

        player.playVideo();
      })
    }

    PubNub.ngSubscribe({
      channel: 'nowplaying',
      callback: function(msg, payload){
        Restangular.all('videos').getList().then(function(videos){
          $scope.allVideos = videos;
        }, function(err){
          console.log('not found')
        })
      }
    })

    $rootScope.newVideo = { url: '' };

    PubNub.ngSubscribe({
      channel: 'playlist',
      callback: function(video_id, payload){
        $scope.allVideos = Restangular.all('videos').getList().$object;
      }
    })

  }
])
