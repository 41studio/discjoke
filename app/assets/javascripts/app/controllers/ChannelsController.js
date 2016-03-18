app.controller('ChannelsController', ['$scope', 'Restangular', 'ngToast', '$uibModal',
  function($scope, Restangular, ngToast, $uibModal){

    $scope.allChannels = Restangular.all('channels').getList().$object

    $scope.editFormState = false
    $scope.channel = { id: '', name: '', url: '', password: '' }
    $scope.currentPage = 1
    // getTotalPage()

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

    $scope.nextPage = function(){
      $scope.currentPage++
      channels = Restangular.all('channels').getList({page: $scope.currentPage}).$object
      // for(channel in channels){
      //   console.log(channel)
        // $scope.allChannels.push(channel)
      // }
    }

    function getTotalPage(){
      Restangular.all('channels').one('get_page_count').get().then(function(channels){
        $scope.totalCount = channels.page_count
      })
    }
  }
]);

