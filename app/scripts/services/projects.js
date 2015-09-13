'user strict';

glance.factory('Projects', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray) {

	var ref = new Firebase(FURL);
	var FBprojects = $firebaseArray(ref.child('projects'));

	var profileRef = ref.child('users');
	
	var auth = $firebaseAuth(ref);

	var Projects = {

		show: function() {
			return FBprojects;
		},

		add: function(e, project) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = project;


					vm.add = function(project) {
						project.creator = Auth.user.uid;
						project.admin = Auth.user.uid;
						//project.users = [1,2,3];
						project.startDate = Firebase.ServerValue.TIMESTAMP;
						project.deadline = '';

						FBprojects.$add(project);
						console.log(project);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('deleter');
						$mdDialog.hide();
					};

				},
				controllerAs: 'PAmodal',
				templateUrl: 'views/newproject.html',
				targetEvent: e
			})
			.then(function() {
				console.log('test');
			});

		},

		update: function(e, project) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = {};
					vm.project = project;

					vm.update = function() {
						//Updates at FB locations with updated project
						ref.child('projects').child(project.$id).update({
							title: project.title,
							description: project.description
						});

						console.log("Updated to: " + project.title + project.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
						ref.child('projects').child(project.$id).remove();

						$mdDialog.hide();
					};
				},
				controllerAs: 'PEmodal',
				templateUrl: 'views/updateproject.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		}

	};

	return Projects;

});






















