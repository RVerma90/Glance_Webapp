'use strict';

glance.controller('ProjectsCtrl', 
	function($scope, 
			 $state, 
			 $mdDialog, 
			 FURL, 
			 $firebaseArray, 
			 $firebaseObject, 
			 $stateParams) {

	var ref = new Firebase(FURL);
	var FBprojects = $firebaseArray(ref.child('projects'));
	$scope.projects = FBprojects;

	$scope.selectProject = function(project) {
		$state.transitionTo("milestones", {pid: project.$id});
		console.log(project.$id);
	}

	$scope.addProject = function(e, project) {
		//Opens material design $mdDialog with following parameters
		//Uses controllerAs syntax

		$mdDialog.show({

			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.project = project;

				$scope.add = function(project) {
					FBprojects.$add(project);
					console.log(project);
					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('deleter');
					$mdDialog.hide();
				};

			},
			controllerAs: 'PAmodal',
			templateUrl: 'views/newproject.html',
			targetEvent: e
		});
	}

	$scope.updateProject = function(e, project) {

		console.log(project);
		//ng-click="updateProject($event, project)"
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: function($scope, $mdDialog) {
				var vm = this;
				vm.project = {};
				vm.project = project;

				$scope.update = function() {
					//Updates at FB locations with updated project
					ref.child('projects').child(project.$id).update({
						title: project.title,
						description: project.description
					});

					console.log("Updated to: " + project.title + project.description);

					$mdDialog.hide();
				};

				$scope.closeDialog = function() {
					console.log('delete');
					ref.child('projects').child(project.$id).remove();

//					figure out a way to remove from firebase and ng-repeat

					$mdDialog.hide();
				};
			},
			controllerAs: 'PEmodal',
			templateUrl: 'views/updateproject.html',
			parent: angular.element(document.body),
			targetEvent: e
		});

	}	

	$scope.removeProject = function($index) {
		console.log("Project Removed");
	}

});