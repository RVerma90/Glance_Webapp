'user strict';

glance.factory('Tasks', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));


	var projectsRef = ref.child('projects');
	var milestonesRef = ref.child('milestones');
	var milestone = $stateParams.mid;
	
	var auth = $firebaseAuth(ref);

	var Tasks = {

		show: function(milestone) {

			console.log(milestone);

			return $firebaseObject(milestonesRef.child(milestone).child('tasks'));

		},

		add: function(e, task) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = task;


					vm.add = function(task) {

						var mid = $stateParams.mid;

						task.creator = Auth.user.uid;
						task.admin = Auth.user.uid;
						//milestone.users = [1,2,3];
						task.startDate = Firebase.ServerValue.TIMESTAMP;
						task.deadline = '';
						task.milestoneID = mid;

						if(task.description == null) {
							task.description = '';
						}							

						FBtasks.$add(task)
						.then(function(newTask) {

							var obj = {
								taskID: newTask.key(),
								title: task.title,
								description: task.description,
								priority: task.priority
							};

							milestonesRef.child(mid).child('tasks').child(obj.taskID).set(obj);

							console.log("mid",mid);

							var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

							var pid = null;

							project.$loaded(function(data) {

								var pid = data.$value;

								projectsRef.child(pid).child('tasks').child(obj.taskID).set(obj);
								
							});

							return newTask;

						});						
						console.log(task);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('deleter');
						$mdDialog.hide();
					};

				},
				controllerAs: 'TAmodal',
				templateUrl: 'views/newtask.html',
				targetEvent: e
			});

		},

		update: function(e, task) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = {};
					vm.task = task;

					console.log(task);

					var mid = $stateParams.mid;					

					vm.update = function() {
						//Updates at FB locations with updated task
						ref.child('tasks').child(task.taskID).update({
							title: task.title,
							description: task.description,
							priority: task.priority
						});

						milestonesRef.child(mid).child('tasks').child(task.taskID).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority
						});					

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

						var pid = null;

						project.$loaded(function(data) {

							var pid = data.$value;

							projectsRef.child(pid).child('tasks').child(task.taskID).update({
								title: vm.task.title,
								description: vm.task.description,
								priority: vm.task.priority								
							});
								
						});						


						console.log("Updated to: " + task.title + task.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
					//	ref.child('tasks').child(task.$id).remove();

					// must remove user from users own task list
					// if user is admin, set next oldest assignee as admin is none exist
					// if no one then remove completely

						ref.child('tasks').child(task.taskID).remove();

						milestonesRef.child(mid).child('tasks').child(task.taskID).remove();

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));
						var pid = null;

						project.$loaded(function(data) {

							var pid = data.$value;

						projectsRef.child(pid).child("tasks").child(task.taskID).remove();

						});							


						$mdDialog.hide();
					};
				},
				controllerAs: 'TEmodal',
				templateUrl: 'views/updatetask.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		}

	};

	return Tasks;

});






















