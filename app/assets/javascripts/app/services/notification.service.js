(function(){
  'use strict'

  angular
    .module('DiscjokeApp')
    .factory('NotificationService', ['$cookies', 'webNotification', NotificationService]);

  function NotificationService ($cookies, webNotification) {
    var service = {
      notify: notify,
      register: register
    }

    return service;

    function register (channel) {
      // Add cookie as sign that user has request to this channel
      if (!registered(channel)) {
        setChannelCookie(channel.url);
      }
    }

    function notify (channel, video) {
      if (!registered(channel)) return true;

      var notificationOpts = {
        body: video.title,
        icon: video.thumbnail,
        onClick: function onNotificationClicked() {
            console.log('Notification clicked.');
        },
        autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
      }

      webNotification
        .showNotification('Discjoke ' + channel.name, notificationOpts, onShow);

      function onShow(error, hide) {
        if (error) console.log('Unable to show notification: ' + error.message);
      }
    }

    // Private function

    function registered (channel) {
      return $cookies.get(getChannelCookieName(channel.url));
    }

    function getChannelCookieName (channelUrl) {
      return 'hasreq-on-' + channelUrl;
    }

    function setChannelCookie (channelUrl) {
      var eightHoursFromNow = new Date(new Date().setHours(new Date().getHours()+8));

      $cookies.put(getChannelCookieName(channelUrl), true,
        { expires: eightHoursFromNow }
      );
    }
  }


})();
