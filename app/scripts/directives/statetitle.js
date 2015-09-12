'use strict';

glance.directive('stateTitle', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function(scope, element) {

        var listener = function(event, toState) {

          var state = '';
          if (toState.data && toState.data.stateName) state = toState.data.stateName;

          $timeout(function() {
            element.text(state);
          }, 0, false);
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);