app.controller('HomeController', ['$scope', '$rootScope', 'Restangular',
  function($scope, $rootScope, Restangular){
    $scope.channels = Restangular.all('channels').getList().$object
  }
])
