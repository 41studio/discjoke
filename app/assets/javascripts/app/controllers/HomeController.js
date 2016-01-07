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

    $scope.allVideos = Restangular.all('videos').getList().$object;
    window.a = $scope.allVideos
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
