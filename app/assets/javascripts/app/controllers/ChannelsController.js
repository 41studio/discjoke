app.controller('ChannelsController', ['$scope', 'Restangular', 'ngToast',
  function($scope, Restangular, ngToast){

    $scope.channels = {
      create: function(channel){
        var baseChannels = Restangular.all('channels');
        baseChannels.post(channel).then(function(channel){

          $scope.index = Restangular.all('channels').getList().$object
          $scope.channel = { id: '', name: '', url: '', password: '' }

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
        var baseChannels = Restangular.one('channels', channel.id)
        baseChannels.put(channel).then(function(channel){

          $scope.index = Restangular.all('channels').getList().$object
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
        $scope.index = Restangular.all('channels').getList().$object
        ngToast.success('Channel successfully removed')
      }
    }

    $scope.editFormState = false
    $scope.channel = { id: '', name: '', url: '', password: '' }
    $scope.index = Restangular.all('channels').getList().$object
    $scope.cancelEdit = function(){
      $scope.channel = { id: '', name: '', url: '', password: '' }
      $scope.editFormState = false
    }
  }
]);

