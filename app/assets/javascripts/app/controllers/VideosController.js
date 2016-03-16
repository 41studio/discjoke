app.controller('VideosController', ['$scope', '$rootScope', 'Restangular', 'ngToast', 'PubNub', '$stateParams', '$location',
  function($scope, $rootScope, Restangular, ngToast, PubNub, $stateParams, $location){

    // Define default channel state
    $scope.isChannelActive = 'not ready yet,..'
    paramsUrl = $stateParams.id

    // Check channel status if active change isChannelActive
    //if false change to false and if no channel found redirect to root
    // Restangular.all('channels').one(paramsUrl).get().then(function(channel){
    //   $scope.isChannelActive = angular.equals(channel.status, 'active')
    // }, function(){
    //   $location.path('/')
    // })

    // Continue initialize if isChannelActive true
    // if($scope.isChannelActive){
    //   var baseUrl         = Restangular.all('videos')
    //   // getTotalPage()
    //   $scope.currentPage  = 1
    //   $scope.videos       = [callVideosData()]
    //   $scope.newVideo     = { url: '' };
    // }

    $scope.video = {
      add: function(video){
        baseUrl.post({video: video, channel_url: paramsUrl}).then(function(video){

        $scope.videos = [callVideosData()]
        $scope.newVideo = { url: '' }
        ngToast.success('Video added.')

        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      }
    }

    // $scope.nextPage = function(currentPage){
    //   $scope.currentPage = currentPage+1
    //   $scope.videos.push(callVideosData())
    // }

    // function callVideosData(){
    //   return baseUrl.getList({channel_url: paramsUrl, page: $scope.currentPage }).$object
    // }

    // function getTotalPage() {
    //   Restangular.one('videos').one('get_page_count', paramsUrl).one('videos').get().then(function(video){
    //     $scope.totalCount = video.page_count
    //   })
    // }

    // PubNub.ngSubscribe({
    //   channel: 'nowplaying',
    //   callback: function(msg, payload){
    //     baseUrl.getList({channel_url: paramsUrl}).then(function(videos){
    //       $scope.videos = [videos];
    //     }, function(err){
    //       console.log('not found')
    //     })
    //   }
    // })


    // PubNub.ngSubscribe({
    //   channel: 'playlist',
    //   callback: function(video_id, payload){
    //     $scope.videos = Restangular.all('videos').getList({channel_url: paramsUrl}).$object;
    //   }
    // })
  }
])
