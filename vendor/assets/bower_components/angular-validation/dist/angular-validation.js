(function() {
  angular.module('validation', ['validation.provider', 'validation.directive']);
  angular.module('validation.provider', []);
  angular.module('validation.directive', ['validation.provider']);
}).call(this);

(function() {
  angular
    .module('validation.provider')
    .provider('$validation', Provider);

  function Provider() {
    var $injector;
    var $scope;
    var $http;
    var $q;
    var $timeout;
    var _this = this;

    /**
     * Setup the provider
     * @param injector
     */
    var setup = function(injector) {
      $injector = injector;
      $scope = $injector.get('$rootScope');
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
    };

    /**
     * Define validation type RegExp
     * @type {{}}
     */
    var expression = {};

    /**
     * default error, success message
     * @type {{}}
     */
    var defaultMsg = {};

    /**
     * Allow user to set a custom Expression, do remember set the default message using setDefaultMsg
     * @param obj
     * @returns {*}
     */
    this.setExpression = function(obj) {
      angular.extend(expression, obj);
      return _this;
    };

    /**
     * Get the Expression
     * @param exprs
     * @returns {*}
     */
    this.getExpression = function(exprs) {
      return expression[exprs];
    };

    /**
     * Allow user to set default message
     * @param obj
     * @returns {*}
     */
    this.setDefaultMsg = function(obj) {
      angular.extend(defaultMsg, obj);
      return _this;
    };

    /**
     * Get the Default Message
     * @param msg
     * @returns {*}
     */
    this.getDefaultMsg = function(msg) {
      return defaultMsg[msg];
    };

    /**
     * Override the errorHTML function
     * @param func
     * @returns {*}
     */
    this.setErrorHTML = function(func) {
      if (func.constructor !== Function) {
        return;
      }
      _this.getErrorHTML = func;
      return _this;
    };

    /**
     * Invalid message HTML, here's the default
     * @param message
     * @returns {string}
     */
    this.getErrorHTML = function(message) {
      return '<p class="validation-invalid">' + message + '</p>';
    };

    /**
     * Override the successHTML function
     * @param func
     * @returns {*}
     */
    this.setSuccessHTML = function(func) {
      if (func.constructor !== Function) {
        return;
      }
      _this.getSuccessHTML = func;
      return _this;
    };

    /**
     * Valid message HTML, here's the default
     * @param message
     * @returns {string}
     */
    this.getSuccessHTML = function(message) {
      return '<p class="validation-valid">' + message + '</p>';
    };

    /**
     * Whether show the validation success message
     * You can easily change this to false in your config
     * example: $validationProvider.showSuccessMessage = false;
     * @type {boolean}
     */
    this.showSuccessMessage = true;

    /**
     * Whether show the validation error message
     * You can easily change this to false in your config
     * example: $validationProvider.showErrorMessage = false;
     * @type {boolean}
     */
    this.showErrorMessage = true;

    /**
     * Check form valid, return true
     * checkValid(Form): Check the specific form(Form) valid from angular `$valid`
     * @param form
     * @returns {boolean}
     */
    this.checkValid = function(form) {
      return !!(form && form.$valid);
    };

    /**
     * Validate the form when click submit, when `validMethod = submit`
     * @param form
     * @returns {promise|*}
     */
    this.validate = function(form) {
      var deferred = $q.defer();
      var idx = 0;

      if (form === undefined) {
        console.error('This is not a regular Form name scope');
        deferred.reject('This is not a regular Form name scope');
        return deferred.promise;
      }

      if (form.validationId) { // single
        $scope.$broadcast(form.$name + 'submit-' + form.validationId, idx++);
      } else if (form.constructor === Array) { // multiple
        for (var k in form) {
          $scope.$broadcast(form[k].$name + 'submit-' + form[k].validationId, idx++);
        }
      } else {
        for (var i in form) { // whole scope
          if (i[0] !== '$' && form[i].hasOwnProperty('$dirty')) {
            $scope.$broadcast(i + 'submit-' + form[i].validationId, idx++);
          }
        }
      }

      deferred.promise.success = function(fn) {
        deferred.promise.then(function(value) {
          fn(value);
        });
        return deferred.promise;
      };

      deferred.promise.error = function(fn) {
        deferred.promise.then(null, function(value) {
          fn(value);
        });
        return deferred.promise;
      };

      $timeout(function() {
        if (_this.checkValid(form)) {
          deferred.resolve('success');
        } else {
          deferred.reject('error');
        }
      });

      return deferred.promise;
    };

    /**
     * Do this function if validation valid
     * @param element
     */
    this.validCallback = null;

    /**
     * Do this function if validation invalid
     * @param element
     */
    this.invalidCallback = null;

    /**
     * reset the specific form
     * @param form
     */
    this.reset = function(form) {
      if (form === undefined) {
        console.error('This is not a regular Form name scope');
        return;
      }

      if (form.validationId) {
        $scope.$broadcast(form.$name + 'reset-' + form.validationId);
      } else if (form.constructor === Array) {
        for (var k in form) {
          $scope.$broadcast(form[k].$name + 'reset-' + form[k].validationId);
        }
      } else {
        for (var i in form) {
          if (i[0] !== '$' && form[i].hasOwnProperty('$dirty')) {
            $scope.$broadcast(i + 'reset-' + form[i].validationId);
          }
        }
      }
    };

    /**
     * $get
     * @returns {{setErrorHTML: *, getErrorHTML: Function, setSuccessHTML: *, getSuccessHTML: Function, setExpression: *, getExpression: Function, setDefaultMsg: *, getDefaultMsg: Function, checkValid: Function, validate: Function, reset: Function}}
     */
    this.$get = ['$injector', function($injector) {
      setup($injector);
      return {
        setErrorHTML: this.setErrorHTML,
        getErrorHTML: this.getErrorHTML,
        setSuccessHTML: this.setSuccessHTML,
        getSuccessHTML: this.getSuccessHTML,
        setExpression: this.setExpression,
        getExpression: this.getExpression,
        setDefaultMsg: this.setDefaultMsg,
        getDefaultMsg: this.getDefaultMsg,
        showSuccessMessage: this.showSuccessMessage,
        showErrorMessage: this.showErrorMessage,
        checkValid: this.checkValid,
        validate: this.validate,
        validCallback: this.validCallback,
        invalidCallback: this.invalidCallback,
        reset: this.reset
      };
    }];
  }
}).call(this);

(function() {
  angular
    .module('validation.directive')
    .directive('validationReset', Reset);

  function Reset($injector) {
    var $validationProvider = $injector.get('$validation');
    var $timeout = $injector.get('$timeout');
    var $parse = $injector.get('$parse');
    return {
      link: function postLink(scope, element, attrs) {
        var form = $parse(attrs.validationReset)(scope);
        $timeout(function() {
          element.on('click', function(e) {
            e.preventDefault();
            $validationProvider.reset(form);
          });
        });
      }
    };
  }
  Reset.$inject = ['$injector'];
}).call(this);

(function() {
  angular
    .module('validation.directive')
    .directive('validationSubmit', Submit);

  function Submit($injector) {
    var $validationProvider = $injector.get('$validation');
    var $timeout = $injector.get('$timeout');
    var $parse = $injector.get('$parse');
    return {
      priority: 1, // execute before ng-click (0)
      require: '?ngClick',
      link: function postLink(scope, element, attrs) {
        var form = $parse(attrs.validationSubmit)(scope);
        $timeout(function() {
          // Disable ng-click event propagation
          element.off('click');
          element.on('click', function(e) {
            e.preventDefault();
            $validationProvider.validate(form)
              .success(function() {
                $parse(attrs.ngClick)(scope);
              });
          });
        });
      }
    };
  }
  Submit.$inject = ['$injector'];
}).call(this);

(function() {
  angular
    .module('validation.directive')
    .directive('validator', Validator);

  function Validator($injector) {
    var $validationProvider = $injector.get('$validation');
    var $q = $injector.get('$q');
    var $timeout = $injector.get('$timeout');

    /**
     * Do this function if validation valid
     * @param element
     * @param validMessage
     * @param validation
     * @param callback
     * @param ctrl
     * @returns {}
     */
    var validFunc = function(element, validMessage, validation, scope, ctrl) {
      var messageToShow = validMessage || $validationProvider.getDefaultMsg(validation).success;
      var messageElem;

      if (scope.messageId) messageElem = angular.element(document.querySelector('#' + scope.messageId));
      else messageElem = element.next();

      if ($validationProvider.showSuccessMessage && messageToShow) messageElem.html($validationProvider.getSuccessHTML(messageToShow));

      ctrl.$setValidity(ctrl.$name, true);
      if (scope.validCallback) scope.validCallback({
        message: messageToShow
      });
      if ($validationProvider.validCallback) $validationProvider.validCallback(element);

      return true;
    };


    /**
     * Do this function if validation invalid
     * @param element
     * @param validMessage
     * @param validation
     * @param callback
     * @param ctrl
     * @returns {}
     */
    var invalidFunc = function(element, validMessage, validation, scope, ctrl) {
      var messageToShow = validMessage || $validationProvider.getDefaultMsg(validation).error;
      var messageElem;

      if (scope.messageId) messageElem = angular.element(document.querySelector('#' + scope.messageId));
      else messageElem = element.next();

      if ($validationProvider.showErrorMessage && messageToShow) {
        messageElem.html($validationProvider.getErrorHTML(messageToShow));
      }

      ctrl.$setValidity(ctrl.$name, false);
      if (scope.invalidCallback) scope.invalidCallback({
        message: messageToShow
      });
      if ($validationProvider.invalidCallback) $validationProvider.invalidCallback(element);

      return false;
    };


    /**
     * collect elements for focus
     * @type {Object}
     ***private variable
     */
    var focusElements = {};


    /**
     * Check Validation with Function or RegExp
     * @param scope
     * @param element
     * @param attrs
     * @param ctrl
     * @param validation
     * @param value
     * @returns {}
     */
    var checkValidation = function(scope, element, attrs, ctrl, validation, value) {
      var validators = validation.slice(0);
      var validatorExpr = validators[0].trim();
      var paramIndex = validatorExpr.indexOf('=');
      var validator = paramIndex === -1 ? validatorExpr : validatorExpr.substr(0, paramIndex);
      var validatorParam = paramIndex === -1 ? null : validatorExpr.substr(paramIndex + 1);
      var leftValidation = validators.slice(1);
      var successMessage = validator + 'SuccessMessage';
      var errorMessage = validator + 'ErrorMessage';
      var expression = $validationProvider.getExpression(validator);
      var valid = {
        success: function() {
          validFunc(element, attrs[successMessage], validator, scope, ctrl);
          if (leftValidation.length) {
            return checkValidation(scope, element, attrs, ctrl, leftValidation, value);
          } else {
            return true;
          }
        },
        error: function() {
          return invalidFunc(element, attrs[errorMessage], validator, scope, ctrl);
        }
      };

      if (expression === undefined) {
        console.error('You are using undefined validator "%s"', validator);
        if (leftValidation.length) return checkValidation(scope, element, attrs, ctrl, leftValidation, value);
        else return;
      }
      // Check with Function
      if (expression.constructor === Function) {
        return $q.all([$validationProvider.getExpression(validator)(value, scope, element, attrs, validatorParam)])
          .then(function(data) {
            if (data && data.length > 0 && data[0]) return valid.success();
            else return valid.error();
          }, function() {
            return valid.error();
          });
      }

      // Check with RegExp
      else if (expression.constructor === RegExp) {
        // Only apply the test if the value is neither undefined or null
        if (value !== undefined && value !== null) return $validationProvider.getExpression(validator).test(value) ? valid.success() : valid.error();
        else return valid.error();
      } else return valid.error();
    };


    /**
     * generate unique guid
     */
    var s4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    var guid = function() {
      return (s4() + s4() + s4() + s4());
    };


    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        initialValidity: '=initialValidity',
        validCallback: '&',
        invalidCallback: '&',
        messageId: '@'
      },
      link: function(scope, element, attrs, ctrl) {
        /**
         * watch
         * @type {watch}
         *
         * Use to collect scope.$watch method
         *
         * use watch() to destroy the $watch method
         */
        var watch = function() {};

        /**
         * validator
         * @type {Array}
         *
         * Convert user input String to Array
         */
        var validation = attrs.validator.split(',');

        /**
         * guid use
         */
        var uid = ctrl.validationId = guid();


        /**
         * Set initial validity to undefined if no boolean value is transmitted
         */
        var initialValidity;
        if (typeof scope.initialValidity === 'boolean') {
          initialValidity = scope.initialValidity;
        }

        /**
         * Default Valid/Invalid Message
         */
        if (!scope.messageId) element.after('<span></span>');

        /**
         * Set custom initial validity
         * Usage: <input initial-validity="true" ... >
         */
        ctrl.$setValidity(ctrl.$name, initialValidity);

        /**
         * Reset the validation for specific form
         */
        scope.$on(ctrl.$name + 'reset-' + uid, function() {
          /**
           * clear scope.$watch here
           * when reset status
           * clear the $watch method to prevent
           * $watch again while reset the form
           */
          watch();

          $timeout(function() {
            ctrl.$setViewValue('');
            ctrl.$setPristine();
            ctrl.$setValidity(ctrl.$name, undefined);
            ctrl.$render();
            if (scope.messageId) angular.element(document.querySelector('#' + scope.messageId)).html('');
            else element.next().html('');
          });
        });

        /**
         * Check validator
         */

        /**
         * Click submit form, check the validity when submit
         */
        scope.$on(ctrl.$name + 'submit-' + uid, function(event, index) {
          var value = ctrl.$viewValue;
          var isValid = false;

          isValid = checkValidation(scope, element, attrs, ctrl, validation, value);

          if (attrs.validMethod === 'submit') {
            // clear previous scope.$watch
            watch();
            watch = scope.$watch('model', function(value, oldValue) {
              value = ctrl.$viewValue;

              // don't watch when init
              if (value === oldValue) {
                return;
              }

              // scope.$watch will translate '' to undefined
              // undefined/null will pass the required submit /^.+/
              // cause some error in this validation
              if (value === undefined || value === null) {
                value = '';
              }

              isValid = checkValidation(scope, element, attrs, ctrl, validation, value);
            });
          }

          var setFocus = function(isValid) {
            if (isValid) {
              delete focusElements[index];
            } else {
              focusElements[index] = element[0];

              $timeout(function() {
                focusElements[Math.min.apply(null, Object.keys(focusElements))].focus();
              }, 0);
            }
          };

          if (isValid.constructor === Object) isValid.then(setFocus);
          else setFocus(isValid);
        });

        /**
         * Validate blur method
         */
        if (attrs.validMethod === 'blur') {
          element.bind('blur', function() {
            var value = ctrl.$viewValue;
            scope.$apply(function() {
              checkValidation(scope, element, attrs, ctrl, validation, value);
            });
          });

          return;
        }

        /**
         * Validate submit & submit-only method
         */
        if (attrs.validMethod === 'submit' || attrs.validMethod === 'submit-only') {
          return;
        }

        /**
         * Validate watch method
         * This is the default method
         */
        scope.$watch('model', function(value) {
          value = ctrl.$viewValue;
          /**
           * dirty, pristine, viewValue control here
           */
          if (ctrl.$pristine && ctrl.$viewValue) {
            // has value when initial
            ctrl.$setViewValue(ctrl.$viewValue);
          } else if (ctrl.$pristine) {
            // Don't validate form when the input is clean(pristine)
            if (scope.messageId) angular.element(document.querySelector('#' + scope.messageId)).html('');
            else element.next().html('');
            return;
          }
          checkValidation(scope, element, attrs, ctrl, validation, value);
        });

        $timeout(function() {
          /**
           * Don't showup the validation Message
           */
          attrs.$observe('noValidationMessage', function(value) {
            var el;
            if (scope.messageId) el = angular.element(document.querySelector('#' + scope.messageId));
            else el = element.next();
            if (value === 'true' || value === true) el.css('display', 'none');
            else if (value === 'false' || value === false) el.css('display', 'block');
          });
        });
      }
    };
  }
  Validator.$inject = ['$injector'];
}).call(this);
