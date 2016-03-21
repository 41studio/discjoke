app.controller('EditChannelController', ['$scope', 'Restangular', '$uibModalInstance', 'channel', 'ngToast',
  function($scope, Restangular, $uibModalInstance, channel, ngToast){
    $scope.channel = channel

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel')
    }

    $scope.updateChannel = function(channel){
      Restangular.one('channels', channel.id).patch({channel: channel}).then(function(channel){
        $uibModalInstance.close(channel)
      }, function(err){
        ngToast.danger(err.data[0])
      })
    }
  }
])
