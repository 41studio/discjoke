app.controller('DjsController', ['$scope', '$rootScope', '$location', 'Restangular', '$stateParams', 'ngToast', '$cookies', 'youtubeEmbedUtils', 'MainYoutube', 'Pubnub',
  function($scope, $rootScope, $location, Restangular, $stateParams, ngToast, $cookies, youtubeEmbedUtils, MainYoutube, Pubnub){

    channelId = $stateParams.id
    $rootScope.dj_logged = $cookies.get('dj')

    // logged dj
    if ($rootScope.dj_logged != undefined) {
      $scope.MainYoutube = MainYoutube

      Restangular.one('channels', channelId).get().then(function(channel){
        $scope.channel = channel
        $scope.videos = channel.videos
      })

      // default video
      $scope.playVideo = { url: 'https://www.youtube.com/watch?v=DokUjuZmpCE' }

      // play video
      $scope.play = function(id){
        Restangular.one('videos', id).one('play').get().then(function(video){
          ytId = youtubeEmbedUtils.getIdFromURL(video.url)
          $scope.MainYoutube.ytPlayer.loadVideoById(ytId)
          $scope.playVideo = video

          updateListVideos(video)
        })
      }

      $scope.delete = function(id){
        controlVideos('next')

        Restangular.one('videos', id).remove().then(function(){
          _.remove($scope.videos, { id: id })

          // Pubnub.publish({
          //   channel: 'playlist',
          //   message: [id, 'delete']
          // })

          ngToast.success('Video deleted.')
        })
      }

      $scope.nextVideo = function(){
        controlVideos('next')
      }

      $scope.prevVideo = function(){
        controlVideos('prev')
      }

      $scope.logout = function(){
        $cookies.remove('dj')
        $rootScope.dj_logged = undefined
      }
    }

    // Check channel status if active change isChannelActive
    //if false change to false and if no channel found redirect to root
    Restangular.all('channels').one(channelId).get().then(function(channel){
      $scope.isChannelActive = angular.equals(channel.status, 'active')
      $cookies.put('dj', channelId)
    }, function(){
      $location.path('/')
    })

    $scope.validatePassword = function(){
      password = document.getElementById('password').value
      Restangular.one('channels', channelId).post('sign_in', {password: password}).then(function(channel){
        $rootScope.login_pass = channel.is_password_valid

        ngToast.success("Log in success")
      }, function(err){
        ngToast.danger("password is incorrect")
      })
    }

    controlVideos = function(type){
      Restangular.one('videos', $scope.playVideo.id).post(type).then(function(video){
        $scope.playVideo = video
        ytId = youtubeEmbedUtils.getIdFromURL(video.url)
        MainYoutube.ytPlayer.loadVideoById(ytId)
        updateListVideos(video)
      })
    }

    updateListVideos = function(video){
      play = _.find($scope.videos, { playing: true })
      nowPlaying = _.find($scope.videos, { id: video.id })

      _.update(nowPlaying, 'playing', function(n){ return true })
      if (play != undefined) {
        _.update(play, 'playing', function(n){ return false })
      }

      Pubnub.publish({
        channel: 'playlist',
        message: [video.id, 'playlist']
      })
    }

    $scope.$on('youtube.player.ended', function($event, player){
      controlVideos('next')
    })

    //
    Pubnub.subscribe({
      channel: 'playlist',
      triggerEvents: ['callback']
    })

    $rootScope.$on(Pubnub.getMessageEventNameFor('playlist'), function(ngEvent, msg, evl, channel){
      $scope.$apply(function(){
        Restangular.one("channels", channelId).get().then(function(channel){
          $scope.videos = channel.videos
        })
      })
    })
  }
])
