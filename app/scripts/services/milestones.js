'user strict';

glance.factory('Milestones', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams) {

	var ref = new Firebase(FURL);
	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var projectsRef = ref.child('projects');
	var project = $stateParams.pid; 

	var auth = $firebaseAuth(ref);

	var Milestones = {

		project: function(project) {
			return $firebaseObject(projectsRef.child(project));
		},

		updateProject: function(e, currentProject) {
			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = {};
					vm.project = currentProject;

					var pid = $stateParams.pid;

//					var n = vm.project.deadline;

//					var d = new Date(n).toString();

					//console.log(n);

					//console.log("toString:",d);

					//calendar having problems  getting 


					vm.update = function() {
						//Updates at FB locations with updated project
						ref.child('projects').child(pid).update({
							title: vm.project.title,
							description: vm.project.description,
							priority: vm.project.priority
						});

						$mdDialog.hide();
					};
				},
				controllerAs: 'PEmodal',
				templateUrl: 'views/updateproject.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},

		show: function(project) {

			console.log(project);

			return $firebaseObject(projectsRef.child(project).child('milestones'));

		},

		add: function(e, milestone) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = milestone;

					vm.add = function(milestone) {

						var pid = $stateParams.pid;

						milestone.creator = Auth.user.uid;
						milestone.admin = Auth.user.uid;
						//milestone.users = [1,2,3];
						milestone.startDate = Firebase.ServerValue.TIMESTAMP;
						milestone.projectID = pid;

						var date = new Date();

						milestone.deadline = date.getTime() + 604800000;

						if(milestone.description == null) {
							milestone.description = '';
						}			

						if(milestone.priority == null) {
							milestone.priority = 0;
						}			

						FBmilestones.$add(milestone)
						.then(function(newMilestone) {

							var obj = {
								milestoneID: newMilestone.key(),
								title: milestone.title,
								description: milestone.description,
								priority: milestone.priority
							};
				
							projectsRef.child(pid).child('milestones').child(obj.milestoneID).set(obj);

							return newMilestone;

						});
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

					console.log(milestone);

					var pid = $stateParams.pid;

					vm.update = function() {
						//Updates at FB locations with updated milestone
						ref.child('milestones').child(milestone.milestoneID).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority
						});

						projectsRef.child(pid).child('milestones').child(milestone.milestoneID).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority
						});

						console.log("Updated to: " + milestone.title + milestone.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
					//	ref.child('milestones').child(milestone.$id).remove();

					// must remove user from users own milestone list
					// if user is admin, set next oldest assignee as admin is none exist
					// if no one then remove completely


						ref.child('milestones').child(milestone.milestoneID).remove();

						projectsRef.child(pid).child('milestones').child(milestone.milestoneID).remove();

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
