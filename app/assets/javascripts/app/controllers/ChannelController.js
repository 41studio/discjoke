app.controller('ChannelController', ['$rootScope', '$scope', 'Restangular', '$stateParams', 'ngToast', 'Pubnub', 'NotificationService',
  function($rootScope, $scope, Restangular, $stateParams, ngToast, Pubnub, NotificationService){
    channelId = $stateParams.id
    $scope.newVideo = { url: '' }
    Restangular.one("channels", channelId).get().then(function(channel){
      $scope.videos = channel.videos
      $scope.channel = channel
      $scope.playingVideo = _.find($scope.videos, { playing: true })
    })

    // form video
    $scope.video = {
      add: function(){
        Restangular.one('channels', channelId).all('videos').post({video: $scope.newVideo}).then(function(video){

        ngToast.success('Video added.')
        $scope.newVideo = { url: '' }

        NotificationService.register($scope.channel)

        Pubnub.publish({
          channel: 'playlist',
          message: [video.id, 'add']
        })

        }, function(err){
          ngToast.danger(err.data[0])
        })
      }
    }

    Pubnub.subscribe({
      channel: 'playlist',
      triggerEvents: ['callback']
    })

    $rootScope.$on(Pubnub.getMessageEventNameFor('playlist'), function(ngEvent, msg, evl, channel){
      $scope.$apply(function(){
        Restangular.one("channels", channelId).get().then(function(channel){
          $scope.videos = channel.videos
          var nowPlaying = _.find($scope.videos, { playing: true })
          if ($scope.playingVideo.title !== nowPlaying.title) NotificationService.notify($scope.channel, nowPlaying)
          $scope.playingVideo = nowPlaying;
        })
      })
    })
  }
]);
