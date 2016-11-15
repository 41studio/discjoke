(function () {
  'use strict';

  angular
    .module('DiscjokeApp')
    .directive('makeFixedWhen', ['$window', makeFixedWhen]);

  function makeFixedWhen ($window) {
    return {
      restrict: 'A',
      scope: {
          fixedClass: "@"
      },
      link: function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
          var minHeight = attrs.makeFixedWhen;
          var origWidth = element[0].clientWidth;

          element.css('width', origWidth + 'px');

          (this.pageYOffset >= minHeight) ?
            element.addClass(scope.fixedClass) : element.removeClass(scope.fixedClass);
        });
      }
    };
  }
}());
