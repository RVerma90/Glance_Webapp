'user strict';

glance.factory('Glance', function(FURL, Auth, $firebaseObject, $firebaseArray, $timeout) {

	var ref = new Firebase(FURL);

	var FBProjects = $firebaseArray(ref.child('projects'));

	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var usersRef = ref.child('users');

	var projectsRef = ref.child('projects');
	var	milestonesRef = ref.child('milestones');

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
			},1000);


			return project;



/*			var project = [];

			projects.$loaded(function() {
				angular.forEach(projects, function(value, key) {
					project.push(value.projectID);
				});
			});

			return project;
*/
		},

		completeProject: function(project) {


			console.log(project);

			var pid = project.projectID;

			ref.child("users").child(user).child("projects").child(pid).child("completed").set(true);
			projectsRef.child(pid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(ref.child("projects").child(pid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {
				ref.child("projects").child(pid).child("completed").set(true);
				angular.forEach(usersDone, function(value, key) {
					
					if (value.$value == false) {
						ref.child("projects").child(pid).child("completed").set(false);
					}
				});
			});

		},

		skipProject: function(project) {
			console.log(milestone.deadline);

			var dayinms = 345600000; //4 days

			milestone.deadline = milestone.deadline + dayinms;

			console.log(milestone.deadline);

		},

		undoProject: function(project) {

			console.log(project);
			console.log(project.projectID);
			var pid = project.projectID;

			ref.child("users").child(user).child("projects").child(pid).child("completed").set(false);
			ref.child("projects").child(pid).child("usersDone").child(user).set(false);	
			ref.child("projects").child(pid).child("completed").set(false);

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
			},1000);


			return milestone;
		},	

		completeMilestone: function(milestone) {

			console.log(milestone);

			var mid = milestone.milestoneID;

			ref.child("users").child(user).child("milestones").child(mid).child("completed").set(true);
			milestonesRef.child(mid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(ref.child("milestones").child(mid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {
				ref.child("milestones").child(mid).child("completed").set(true);
				angular.forEach(usersDone, function(value, key) {
					
					if (value.$value == false) {
						ref.child("milestones").child(mid).child("completed").set(false);
					}
				});
			});


//			tasksRef.child(tid).child("usersDone").child(user).set(true);

			//check task did all users complete, is yes, complete this task in milestones and in tasks
			//milestonesRef.child(mid).child("tasksCompleted").child(tid).set(true);


		},

		skipMilestone: function(milestone) {
			console.log(milestone.deadline);

			var dayinms = 172800000;

			milestone.deadline = milestone.deadline + dayinms;

			console.log(milestone.deadline);

		},

		undoMilestone: function(milestone) {

			console.log(milestone);
			var mid = milestone.milestoneID;
			console.log(mid);

			ref.child("users").child(user).child("milestones").child(mid).child("completed").set(false);
			milestonesRef.child(mid).child("usersDone").child(user).set(false);
			milestonesRef.child(mid).child("completed").set(false);
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
			},1000);


			return task;
		},

		completeTask:function(task) {
			console.log(task.taskID);
			var tid = task.taskID;
//			var mid = task.milestoneID;

			ref.child("users").child(user).child("tasks").child(tid).child("completed").set(true);
			ref.child("tasks").child(tid).child("usersDone").child(user).set(true);

			var usersDone = $firebaseArray(ref.child("tasks").child(tid).child("usersDone"));
			console.log(usersDone);

			usersDone.$loaded(function() {
				ref.child("tasks").child(tid).child("completed").set(true);
//				milestonesRef.child(mid).child('tasksDone').child(tid).set(true);
				angular.forEach(usersDone, function(value, key) {
					
					if (value.$value == false) {
						ref.child("tasks").child(tid).child("completed").set(false);
//						milestonesRef.child(mid).child('tasksDone').child(tid).set(false);
					}
				});
			});
		},

		skipTask:function(task) {
			console.log(task.deadline);
		
			var dayinms = 86400000;			

			task.deadline = task.deadline + dayinms;

			console.log(task.deadline);


		},

		undoTask:function(task) {
			console.log(task);
			console.log(task.taskID);
			var tid = task.taskID;
//			var mid = task.milestoneID;

			ref.child("users").child(user).child("tasks").child(tid).child("completed").set(false);
			ref.child("tasks").child(tid).child("usersDone").child(user).set(false);	
			ref.child("tasks").child(tid).child("completed").set(false);
//			milestonesRef.child(mid).child('tasksDone').child(tid).set(false);


		},

		milestonesOLD: function() {

			var project = Glance.projects();

			var milestone = [];
			var length = project.length;

			//instead of timeout, change to promise resolve

			$timeout(function() {
				for (var i = 0; i < project.length; i++) {

					var milestones = $firebaseArray(projectsRef.child(project[i]).child('milestones'));

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
				};
			},2000);


			return milestone;
		},	

		tasksOLD: function() {

			var project = Glance.projects();

			var task = [];
			var length = project.length;

			$timeout(function() {
				for (var i = 0; i < project.length; i++) {

					var tasks = $firebaseArray(projectsRef.child(project[i]).child('tasks'));

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
				};
			},2000);


			return task;
		}


	};

	return Glance;


});
