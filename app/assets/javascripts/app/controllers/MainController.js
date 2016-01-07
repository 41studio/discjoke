app.controller('MainController', ['$scope', 'Restangular', 'PubNub',
  function($scope, Restangular, PubNub){
    PubNub.init({
      publish_key:'pub-c-723e6af6-05bd-4d9c-957b-9ecc8fb3f32d',
      subscribe_key:'sub-c-4e07d514-9c8d-11e5-9a49-02ee2ddab7fe',
      uuid: '1'
    });

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

  }
])
