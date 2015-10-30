'use strict';

glance.directive('autoScroll', function () {  
  return function(scope, element, attrs) {
    var pos = element[0].parentNode.parentNode.scrollHeight;

    console.log(pos);
    $(element).parent().parent().animate({
      scrollTop : pos
    }, 0);
  }
});