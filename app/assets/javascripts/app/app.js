var app = angular.module('DiscjokeApp', [
  'templates',
  'ui.router',
  'restangular.config',
  'pubnub.angular.service',
  'ngToast',
  'youtube-embed',
  'ui.bootstrap',
  'ngCookies',
  'nprogress-rails',
  'angular-web-notification'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'ngToastProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, ngToastProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/index.html',
        controller: 'HomeController'
      })

      .state('bossdj', {
        url: '/bossdj',
        templateUrl: 'channels/boss.html',
        controller: 'ChannelsController'
      })

      .state('channel', {
        url: '/:id',
        templateUrl: 'channels/show.html',
        controller: 'ChannelController'
      })

      .state('channelDj', {
        url: '/:id/dj',
        templateUrl: 'channels/dj.html',
        controller: 'DjsController'
      })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    ngToastProvider.configure({
      animate: 'slide',
      dismissButton: true,
      maxNumber: 5
    })
  }
])
.constant('_', window._)
.run(['$rootScope',
  function($rootScope){
    $rootScope._ = window._
  }
])
