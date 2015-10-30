'user strict';

glance.factory('Glance', function(FURL, Auth, $firebaseObject, $firebaseArray, $timeout, Projects, Milestones, Tasks, Task) {

	var ref = new Firebase(FURL);

	var FBProjects = $firebaseArray(ref.child('projects'));

	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var usersRef = ref.child('users');

	var projectsRef = ref.child('projects');
	var	milestonesRef = ref.child('milestones');
	var	tasksRef = ref.child('tasks');

	var user = ref.getAuth().uid;


	var Glance = {
		projects: function() {


			var project = [];
			//instead of timeout, change to promise resolve
			$timeout(function() {

					var projects = $firebaseArray(usersRef.child(user).child('projects'));

					projects.$loaded(function(data) {
						data.forEach(function(entry) {
							var now = (new Date).getTime();
							var daysToDeadline = (entry.deadline - now)/86400000; //day in milliseconds
							var order = entry.priority/daysToDeadline;

							entry.order = order;

							project.push(entry);
						});

						return project;
					}).then(function(data) {
						project = data;

						project.sort(function(a, b) {
							return parseFloat(b.order) - parseFloat(a.order);


						});

						console.log(project);

					});
			},500);


			return project;

		},

		completeProject: function(project) {


			console.log(project);

			var pid = project.projectID;

			usersRef.child(user).child("projects").child(pid).child("completed").set(true);
			projectsRef.child(pid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(projectsRef.child(pid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {
				projectsRef.child(pid).child("completed").set(true);
				angular.forEach(usersDone, function(value, key) {
					
					if (value.$value == false) {
						projectsRef.child(pid).child("completed").set(false);
					}
				});
			});

		},

		skipProject: function(project) {
			console.log(project.deadline);

			var dayinms = 86400000; //1 day
			project.deadline = project.deadline + dayinms;

			projectsRef.child(project.projectID).update({
				deadline: project.deadline
			});

			console.log(project.deadline);

			var date = new Date(project.deadline);

			console.log(date);

			Milestones.syncProjectDetails(project, project.projectID);

		},

		undoProject: function(project) {

			console.log(project);
			console.log(project.projectID);
			var pid = project.projectID;

			usersRef.child(user).child("projects").child(pid).child("completed").set(false);
			projectsRef.child(pid).child("usersDone").child(user).set(false);	
			projectsRef.child(pid).child("completed").set(false);

		},

		milestones: function() {

			var milestone = [];
			//instead of timeout, change to promise resolve
			$timeout(function() {

					var milestones = $firebaseArray(usersRef.child(user).child('milestones'));

					milestones.$loaded(function(data) {
						data.forEach(function(entry) {
							var now = (new Date).getTime();
							var daysToDeadline = (entry.deadline - now)/86400000; //day in milliseconds
							var order = entry.priority/daysToDeadline;

							entry.order = order;

							milestone.push(entry);
						});

						return milestone;
					}).then(function(data) {
						milestone = data;

						milestone.sort(function(a, b) {
							return parseFloat(b.order) - parseFloat(a.order);


						});

						console.log(milestone);

					});
			},500);


			return milestone;
		},	

		completeMilestone: function(milestone) {

			console.log(milestone);

			var mid = milestone.milestoneID;
			var pid = milestone.projectID;

			usersRef.child(user).child("milestones").child(mid).child("completed").set(true);
			milestonesRef.child(mid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(milestonesRef.child(mid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {
				milestonesRef.child(mid).child("completed").set(true);
				projectsRef.child(pid).child("milestones").child(mid).child("completed").set(true);
				angular.forEach(usersDone, function(value, key) {
					
					if (value.$value == false) {
						milestonesRef.child(mid).child("completed").set(false);
						projectsRef.child(pid).child("milestones").child(mid).child("completed").set(false);
					}
				});
			});

		},

		skipMilestone: function(milestone) {

			console.log(milestone.deadline);


			if(milestone.deadline < milestone.projectDeadline) {

				var dayinms = 86400000; //1 day
				milestone.deadline = milestone.deadline + dayinms;

				milestonesRef.child(milestone.milestoneID).update({
					deadline: milestone.deadline
				});

				projectsRef.child(milestone.projectID).child("milestones").child(milestone.milestoneID).update({
					deadline: milestone.deadline
				});

				Tasks.syncMilestoneDetails(milestone, milestone.milestoneID);

			} else {
				console.log("Project Deadline");
			}

		},

		undoMilestone: function(milestone) {

			console.log(milestone);
			var mid = milestone.milestoneID;
			var pid = milestone.projectID;
			console.log(mid);

			usersRef.child(user).child("milestones").child(mid).child("completed").set(false);
			milestonesRef.child(mid).child("usersDone").child(user).set(false);
			milestonesRef.child(mid).child("completed").set(false);
			projectsRef.child(pid).child("milestones").child(mid).child("completed").set(false);
		},

		tasks: function() {

			var task = [];

			$timeout(function() {

					var tasks = $firebaseArray(usersRef.child(user).child('tasks'));

					tasks.$loaded(function(data) {
						data.forEach(function(entry) {
							var now = (new Date).getTime();
							var daysToDeadline = (entry.deadline - now)/86400000; //day in milliseconds
							var order = entry.priority/daysToDeadline;

							entry.order = order;

							task.push(entry);
						});

						return task;
					}).then(function(data) {
						task = data;

						task.sort(function(a, b) {
							return parseFloat(b.order) - parseFloat(a.order);
						});
						console.log(task);

					});
			},500);


			return task;
		},

		completeTask:function(task) {
			//find a way to get mid&pid to complete in mid&pid

			console.log(task.milestoneID);
			console.log(task.projectID);
			var tid = task.taskID;
			var mid = task.milestoneID;
			var pid = task.projectID;

			usersRef.child(user).child("tasks").child(tid).child("completed").set(true);
			tasksRef.child(tid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(tasksRef.child(tid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {

					tasksRef.child(tid).child("completed").set(true);
					milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(true);
					milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(true);
					projectsRef.child(pid).child("tasks").child(tid).child("completed").set(true);
					angular.forEach(usersDone, function(value, key) {
						
						if (value.$value == false) {
							tasksRef.child(tid).child("completed").set(false);
							milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(false);
							projectsRef.child(pid).child("tasks").child(tid).child("completed").set(false);
						}
					});
			});
		},

		skipTask:function(task) {

			console.log(task.milestoneID);
			console.log(task.projectID);


			if(task.deadline < task.milestoneDeadline) {
				
				var dayinms = 86400000; //1 day
				task.deadline = task.deadline + dayinms;				
			
				tasksRef.child(task.taskID).update({
					deadline: task.deadline
				});

				milestonesRef.child(task.milestoneID).child("tasks").child(task.taskID).update({
					deadline: task.deadline
				});

				projectsRef.child(task.projectID).child("tasks").child(task.taskID).update({
					deadline: task.deadline
				});

				Task.updateTaskUsers(task, task.taskID);
			} else {
				console.log("Milestone Deadline");
			}


		},

		undoTask:function(task) {
			//find a way to get mid&pid to complete in mid&pid
			console.log(task);
			console.log(task.milestoneID);
			console.log(task.projectID);
			var tid = task.taskID;
			var mid = task.milestoneID;
			var pid = task.projectID;

			usersRef.child(user).child("tasks").child(tid).child("completed").set(false);
			tasksRef.child(tid).child("usersDone").child(user).set(false);	
			tasksRef.child(tid).child("completed").set(false);
			milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(false);
			projectsRef.child(pid).child("tasks").child(tid).child("completed").set(false);

		}

	};

	return Glance;


});
