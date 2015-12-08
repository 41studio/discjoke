app.controller('HomeController', ['$scope', 'Restangular',
  function($scope, Restangular){
    $scope.isDj = function(){
      if(window.location.hostname == 'localhost'){
        return true;
      }

      return false;
    }

    $scope.nowPlay = function(){
      
    }
  }
])