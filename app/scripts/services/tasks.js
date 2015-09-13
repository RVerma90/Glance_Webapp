'user strict';

glance.factory('Tasks', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));

	var profileRef = ref.child('users');
	
	var auth = $firebaseAuth(ref);

	var Tasks = {

		show: function() {
			return FBtasks;
		},

		add: function(e, task) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = task;


					vm.add = function(task) {
						task.creator = Auth.user.uid;
						task.admin = Auth.user.uid;
						//milestone.users = [1,2,3];
						task.startDate = Firebase.ServerValue.TIMESTAMP;
						task.deadline = '';

						FBtasks.$add(task);
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

					vm.update = function() {
						//Updates at FB locations with updated task
						ref.child('tasks').child(task.$id).update({
							title: task.title,
							description: task.description
						});

						console.log("Updated to: " + task.title + task.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
						ref.child('tasks').child(task.$id).remove();

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






















