app.controller('ChannelsController', ['$scope', 'Restangular', 'ngToast', '$uibModal',
  function($scope, Restangular, ngToast, $uibModal){

    $scope.allChannels = Restangular.all('channels').getList().$object

    $scope.editFormState = false
    $scope.channel = { id: '', name: '', url: '', password: '' }

    $scope.channels = {
      create: function(channel){
        Restangular.all('channels').post(channel).then(function(channel){
          $scope.channel = { id: '', name: '', url: '', password: '' }
          ngToast.success('Channel added.')
          $scope.allChannels.push(channel)
        }, function(err){
          ngToast.danger(err.data.errors[0])
        })
      },
      edit: function(channel){
        $scope.channel = {
          id: channel.id,
          name: channel.name,
          url: channel.url,
          password: ''
        }

        $scope.editFormState = true
      },
      update: function(channel){
        Restangular.one('channels', channel.id).patch({channel: channel}).then(function(channel){
          $scope.editFormState = false
          _.remove($scope.allChannels, { id: channel.id })
          $scope.allChannels.push(channel)

          $scope.channel = {}
          ngToast.success('Channel Updated.')
        }, function(err){
          ngToast.danger(err.data[0])
        })
      },
      remove: function(channelId){
        Restangular.one('channels', channelId).remove().then(function(){
          _.remove($scope.allChannels, { id: channelId })
          ngToast.success('Channel successfully removed')
        })
      }
    }

    $scope.cancelEdit = function(){
      $scope.channel = { id: '', name: '', url: '', password: '' }
      $scope.editFormState = false
    }

    $scope.nextPage = function(){
      $scope.currentPage++
      channels = Restangular.all('channels').getList({page: $scope.currentPage}).$object
    }

    function getTotalPage(){
      Restangular.all('channels').one('get_page_count').get().then(function(channels){
        $scope.totalCount = channels.page_count
      })
    }
  }
]);

