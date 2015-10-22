'user strict';

glance.factory('Nav', function($state, $stateParams, $mdSidenav, Auth) {

	var Nav = {
	
		toggleNavbar: function() { 
			$mdSidenav('left').toggle();
		}


	};

	return Nav;

});


