'use strict';

glance.controller('TasksCtrl', 
	function($scope, 
			 $state, 
			 $mdDialog, 
			 FURL, 
			 $firebaseArray, 
			 $firebaseObject, 
			 $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));
	$scope.tasks = FBtasks;

	var TID = $stateParams.taskID;

	$scope.selectTask = function($stateParam, task) {
		$state.go('glanceboard');
	}

	$scope.addTask = function(e, task) {
		//Opens material design $mdDialog with following parameters
		//Uses controllerAs syntax

		$mdDialog.show({

			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.task = task;

				$scope.add = function(task) {
					FBtasks.$add(task);
					console.log(task);
					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('deleter');
					$mdDialog.hide();
				};

			},
			controllerAs: 'TAmodal',
			templateUrl: 'views/newtask.html',
			targetEvent: e
		});
	}

	$scope.updateTask = function(e, task) {

		console.log(task);
		//ng-click="updateTask($event, task)"
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.task = {};
				vm.task = task;

				$scope.update = function() {
					//Updates at FB locations with updated task
					ref.child('tasks').child(task.$id).update({
						title: task.title,
						description: task.description
					});

					console.log("Updated to: " + task.title + task.description);

					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('delete');
					ref.child('tasks').child(task.$id).remove();

//					figure out a way to remove from firebase and ng-repeat

					$mdDialog.hide();
				};
			},
			controllerAs: 'TEmodal',
			templateUrl: 'views/updatetask.html',
			parent: angular.element(document.body),
			targetEvent: e
		});

	}	

	$scope.removeTask = function($index) {
		console.log("Task Removed");
	}

});