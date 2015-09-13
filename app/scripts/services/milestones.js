'user strict';

glance.factory('Milestones', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray) {

	var ref = new Firebase(FURL);
	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var profileRef = ref.child('users');
	
	var auth = $firebaseAuth(ref);

	var Milestones = {

		show: function() {
			return FBmilestones;
		},

		add: function(e, milestone) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = milestone;


					vm.add = function(milestone) {
						milestone.creator = Auth.user.uid;
						milestone.admin = Auth.user.uid;
						//milestone.users = [1,2,3];
						milestone.startDate = Firebase.ServerValue.TIMESTAMP;
						milestone.deadline = '';

						FBmilestones.$add(milestone);
						console.log(milestone);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('deleter');
						$mdDialog.hide();
					};

				},
				controllerAs: 'MAmodal',
				templateUrl: 'views/newmilestone.html',
				targetEvent: e
			});

		},

		update: function(e, milestone) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = {};
					vm.milestone = milestone;

					vm.update = function() {
						//Updates at FB locations with updated milestone
						ref.child('milestones').child(milestone.$id).update({
							title: milestone.title,
							description: milestone.description
						});

						console.log("Updated to: " + milestone.title + milestone.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
						ref.child('milestones').child(milestone.$id).remove();

						$mdDialog.hide();
					};
				},
				controllerAs: 'MEmodal',
				templateUrl: 'views/updatemilestone.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		}

	};

	return Milestones;

});






















