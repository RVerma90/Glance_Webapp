'use strict';

glance.filter('deadline', function() {
	return function(input, scope){
		if (input !=null) {
			input = moment(input).fromNow();
			return input;
		}
	}
});

glance.filter('hourMinute', function() {
	return function(input, scope) {
		if (input != null){
			input = moment(input).format('h:mm a');
			return input;
		}
	}
});