app.controller('VideosController', ['$scope', '$rootScope', 'Restangular', 'ngToast', 'PubNub',
  function($scope, $rootScope, Restangular, ngToast, PubNub){
    $scope.videos = Restangular.all('videos').getList().$object
    $scope.video = {
      add: function(video){
        var request = Restangular.all('videos');
        $scope.videos = Restangular.all('videos').getList().$object
        request.post({video: video}).then(function(video){
          PubNub.ngPublish({
            channel: 'playlist',
            message: video.id
          });

          $scope.newVideo = { url: '' }

          ngToast.success('Video added.')
        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      }
    }

    PubNub.ngSubscribe({
      channel: 'nowplaying',
      callback: function(msg, payload){
        Restangular.all('videos').getList().then(function(videos){
          $scope.videos = videos;
        }, function(err){
          console.log('not found')
        })
      }
    })

    $scope.newVideo = { url: '' };

    PubNub.ngSubscribe({
      channel: 'playlist',
      callback: function(video_id, payload){
        $scope.videos = Restangular.all('videos').getList().$object;
      }
    })
  }
])
