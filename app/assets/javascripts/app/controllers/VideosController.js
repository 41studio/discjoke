app.controller('VideosController', ['$scope', '$rootScope', 'Restangular', 'ngToast', 'PubNub', '$stateParams', '$location',
  function($scope, $rootScope, Restangular, ngToast, PubNub, $stateParams, $location){

    $scope.isChannelActive = 'not ready yet,..'
    paramsUrl = $stateParams.url

    Restangular.all('channels').one('show', paramsUrl).get().then(function(channel){
      $scope.isChannelActive = angular.equals(channel.status, 'active')
      $scope.channel = channel
    }, function(){
      $location.path('/')
    })

    if($scope.isChannelActive){
      $scope.videos = Restangular.all('videos').getList({channel_url: paramsUrl}).$object
      $scope.newVideo = { url: '' };
    }

    $scope.video = {
      add: function(video){
        var request = Restangular.all('videos');
        request.post({video: video, channel_url: paramsUrl}).then(function(video){
        $scope.videos = Restangular.all('videos').getList({channel_url: paramsUrl}).$object

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
        Restangular.all('videos').getList({channel_url: paramsUrl}).then(function(videos){
          $scope.videos = videos;
        }, function(err){
          console.log('not found')
        })
      }
    })


    PubNub.ngSubscribe({
      channel: 'playlist',
      callback: function(video_id, payload){
        $scope.videos = Restangular.all('videos').getList({channel_url: paramsUrl}).$object;
      }
    })
  }
])
