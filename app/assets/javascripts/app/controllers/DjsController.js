app.controller('DjsController', ['$scope', '$location', 'Restangular', '$stateParams', 'ngToast',
  function($scope, $location, Restangular, $stateParams, ngToast){

    paramsUrl = $stateParams.url
    $scope.login_pass = false

    // Check channel status if active change isChannelActive
    //if false change to false and if no channel found redirect to root
    Restangular.all('channels').one('show', paramsUrl).get().then(function(channel){
      $scope.isChannelActive = angular.equals(channel.status, 'active')
    }, function(){
      $location.path('/')
    })

    $scope.validatePassword = function(){
      password = document.getElementById('password').value
      Restangular.all('channels').one('sign_in', paramsUrl).get({password: password}).then(function(channel){
        $scope.login_pass = channel.is_password_valid
        if($scope.login_pass){
          ngToast.success("Log in success")
        }else{
          ngToast.danger("password is incorrect")
        }
      })
    }

  }
])
