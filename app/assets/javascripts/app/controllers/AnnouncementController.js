app.controller('AnnouncementController', ['$scope', 'Restangular', '$uibModalInstance', 'channel', 'ngToast',
  function($scope, Restangular, $uibModalInstance, channel, ngToast){
    $scope.channel = channel

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel')
    }

    $scope.updateAnnouncement = function(channel){
      console.log($scope.channel)
      Restangular.one('channels', $scope.channel.url).patch({channel: channel}).then(function(channel){
        $uibModalInstance.close(channel)
      }, function(err){
        ngToast.danger(err.data[0])
      })
    }
  }
])
