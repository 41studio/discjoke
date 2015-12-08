app.controller('VideosController', ['$scope', '$rootScope', 'Restangular', 'ngToast', 'PubNub',
  function($scope, $rootScope, Restangular, ngToast, PubNub){
    $scope.videos = {
      add: function(video){
        var request = Restangular.all('videos');
        request.post({video: video}).then(function(video){
          PubNub.ngPublish({
            channel: 'playlist',
            message: video.id
          });
          
          $rootScope.newVideo = { url: '' }

          ngToast.success('Video added.')
        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      }
    }
  }
])