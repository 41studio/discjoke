app.controller('DjsController', ['$scope', '$location', 'Restangular', '$stateParams', 'ngToast', '$cookies',
  function($scope, $location, Restangular, $stateParams, ngToast, $cookies){

    channelId = $stateParams.id
    logged = $cookies.get('dj')

    $scope.login_pass = false

    // logged dj
    if (logged == channelId) {
      $scope.login_pass = true

      Restangular.one('channels', channelId).get().then(function(channel){
        $scope.channel = channel
        $scope.videos = channel.videos
      })
    }

    // Check channel status if active change isChannelActive
    //if false change to false and if no channel found redirect to root
    Restangular.all('channels').one(channelId).get().then(function(channel){
      $scope.isChannelActive = angular.equals(channel.status, 'active')
      $cookies.put('dj', channelId)
    }, function(){
      $location.path('/')
    })

    $scope.validatePassword = function(){
      password = document.getElementById('password').value
      Restangular.one('channels', channelId).post('sign_in', {password: password}).then(function(channel){
        $scope.login_pass = channel.is_password_valid

        ngToast.success("Log in success")
      }, function(err){
        ngToast.danger("password is incorrect")
      })
    }

  }
])
