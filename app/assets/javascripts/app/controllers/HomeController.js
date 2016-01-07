app.controller('HomeController', ['$scope', '$rootScope', 'Restangular', 'PubNub',
  function($scope, $rootScope, Restangular, PubNub){
    $scope.isDj = function(){
      if(window.location.hostname == 'localhost'){
        return true;
      }

      return false;
    }

    $scope.nowPlay = function(){

    }

    if ($scope.isDj) {
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
