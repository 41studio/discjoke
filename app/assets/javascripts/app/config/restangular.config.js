(function(){

angular.module('restangular.config', ['restangular'])
.config(['RestangularProvider',
  function(RestangularProvider){
    RestangularProvider.setBaseUrl('/api');
  }
])

})();