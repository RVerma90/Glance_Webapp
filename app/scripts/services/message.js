'use strict';

glance.factory('Messages', function(FURL, Auth, $firebaseObject) {
	
	var ref = new Firebase(FURL);

	var user = Auth.user.userData;

	var projectsRef = ref.child("projects");
	var milestonesRef = ref.child("milestones");
	var tasksRef = ref.child("tasks");

	var Messages = {

		project: function(project) {
			console.log(project);
			var pref = $firebaseObject(projectsRef.child(project));
			console.log(pref);
			return pref;
		},

		projectMessages: function(project) {
			console.log(project);
			var pmessages = $firebaseObject(projectsRef.child(project).child("messages"));
			console.log(pmessages);
			return pmessages;
		},

		sendPMessage: function(project, message) {
			console.log(project);
			console.log(message);

			var now = new Date();
			var currentUser = Auth.user.userData;
			var newMessage = {
				text: message,
				sender: currentUser.firstName,
				uid: currentUser.uid,
				timestamp: now.getTime()
			};

			if(message == '') {
				console.log("no message");
			} else {
				projectsRef.child(project).child("messages").push(newMessage);				
			}

		},

		milestone: function(milestone) {
			console.log(milestone);
			var mref = $firebaseObject(milestonesRef.child(milestone));
			console.log(mref);
			return mref;
		},

		milestoneMessages:function(milestone) {
			console.log(milestone);
			var mmessages = $firebaseObject(milestonesRef.child(milestone).child("messages"));
			console.log(mmessages);
			return mmessages;
		},

		sendMMessage: function(milestone, message) {
			console.log(milestone);
			console.log(message);

			var now = new Date();
			var currentUser = Auth.user.userData;
			var newMessage = {
				text: message,
				sender: currentUser.firstName,
				uid: currentUser.uid,
				timestamp: now.getTime()
			};

			if(message == '') {
				console.log("no message");
			} else {
				milestonesRef.child(milestone).child("messages").push(newMessage);				
			}

		},

		task: function(task) {
			console.log(task);
			var tref = $firebaseObject(tasksRef.child(task));
			console.log(tref);
			return tref;
		},

		taskMessages: function(task) {
			console.log(task);
			var tmessages = $firebaseObject(tasksRef.child(task).child("messages"));
			console.log(tmessages);
			return tmessages;
		},

		sendTMessage: function(task, message) {
			console.log(task);
			console.log(message);

			var now = new Date();
			var currentUser = Auth.user.userData;
			var newMessage = {
				text: message,
				sender: currentUser.firstName,
				uid: currentUser.uid,
				timestamp: now.getTime()
			};

			if(message == '') {
				console.log("no message");
			} else {
				tasksRef.child(task).child("messages").push(newMessage);				
			}

		}


	};

	return Messages;


});
