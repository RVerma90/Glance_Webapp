'use strict';

glance.directive('enterKey', [,
  function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {


        }

      });
    }
  }
]);