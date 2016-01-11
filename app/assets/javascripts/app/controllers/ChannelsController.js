app.controller('ChannelsController', ['$scope', 'Restangular', 'ngToast', '$stateParams', '$uibModal', 'PubNub',
  function($scope, Restangular, ngToast, $stateParams,  $uibModal, PubNub){

    $scope.editFormState = false
    $scope.channel = { id: '', name: '', url: '', password: '' }
    $scope.index = [Restangular.all('channels').getList().$object]
    $scope.currentPage = 1
    getTotalPage()

    $scope.channels = {
      create: function(channel){
        var baseChannels = Restangular.all('channels');
        baseChannels.post(channel).then(function(channel){
          $scope.index.unshift(Restangular.all('channels').getList().$object)
          $scope.channel = { id: '', name: '', url: '', password: '' }
          getTotalPage()
          ngToast.success('Channel added.')
        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      },
      edit: function(channel){
        $scope.channel.id = channel.id
        $scope.channel.name = channel.name
        $scope.channel.url = channel.url
        $scope.channel.password = channel.password
        $scope.editFormState = true

      },
      update: function(channel){
        var baseChannels = Restangular.one('channels', channel.id);
        baseChannels.put(channel).then(function(channel){

          $scope.index = [Restangular.all('channels').getList().$object]
          $scope.currentPage = 1
          $scope.channel = { id: '', name: '', url: '', password: '' }
          $scope.editFormState = false

          ngToast.success('Channel Updated.')
        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      },
      remove: function(channel_id){
        var baseChannels = Restangular.one('channels').one('remove', channel_id);
        baseChannels.put()
        $scope.index = [Restangular.all('channels').getList().$object]
        $scope.currentPage = 1
        ngToast.success('Channel successfully removed')
      }
    }

    $scope.cancelEdit = function(){
      $scope.channel = { id: '', name: '', url: '', password: '' }
      $scope.editFormState = false
    }

    $scope.nextPage = function(currentPage){
      $scope.index.push(Restangular.all('channels').getList({page: currentPage+1}).$object)
      $scope.currentPage = currentPage+1
    }

    function getTotalPage(){
      Restangular.all('channels').one('get_page_count').get().then(function(channels){
        $scope.totalCount = channels.page_count
      })
    }

    $scope.isDj = function(){
      if(window.location.hostname == 'localhost'){
        return true;
      }

      return false;
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
]);

