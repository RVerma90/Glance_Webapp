'use strict';

glance.controller('MilestonesCtrl', 
	function($scope, 
			 $state, 
			 $mdDialog, 
			 FURL, 
			 $firebaseArray, 
			 $firebaseObject, 
			 $stateParams) {

	var ref = new Firebase(FURL);
	var FBmilestones = $firebaseArray(ref.child('milestones'));
	$scope.milestones = FBmilestones;

	$scope.selectMilestone = function(milestone) {
		$state.transitionTo("tasks", {pid: milestone.$id});
		console.log(milestone.$id);


	}

	$scope.addMilestone = function(e, milestone) {
		//Opens material design $mdDialog with following parameters
		//Uses controllerAs syntax

		$mdDialog.show({

			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.milestone = milestone;

				$scope.add = function(milestone) {
					FBmilestones.$add(milestone);
					console.log(milestone);
					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('deleter');
					$mdDialog.hide();
				};

			},
			controllerAs: 'MAmodal',
			templateUrl: 'views/newmilestone.html',
			targetEvent: e
		});
	}

	$scope.updateMilestone = function(e, milestone) {

		console.log(milestone);
		//ng-click="updateTask($event, task)"
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.milestone = {};
				vm.milestone = milestone;

				$scope.update = function() {
					//Updates at FB locations with updated task
					ref.child('milestones').child(milestone.$id).update({
						title: milestone.title,
						description: milestone.description
					});

					console.log("Updated to: " + milestone.title + milestone.description);

					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('delete');
					ref.child('milestones').child(milestone.$id).remove();

//					figure out a way to remove from firebase and ng-repeat

					$mdDialog.hide();
				};
			},
			controllerAs: 'MEmodal',
			templateUrl: 'views/updatemilestone.html',
			parent: angular.element(document.body),
			targetEvent: e
		});

	}	

	$scope.removeTask = function($index) {
		console.log("Milestone Removed");
	}

});