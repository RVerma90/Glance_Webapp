'user strict';

glance.factory('Contacts', function(FURL, Auth, $firebaseObject, $firebaseArray) {

	var ref = new Firebase(FURL);

	var usersRef = ref.child('users').orderByChild("email");

	var user = ref.getAuth().uid;

	var Contacts = {

		show: function() {

			return $firebaseObject(ref.child('users').child(user).child('contacts'));

		},

		reqShow: function() {

			return $firebaseObject(ref.child('users').child(user).child('requests'));
			
		},

		accept: function(contact) {

			var currentUser = Auth.user.userData;	
				
				console.log(contact);
				console.log(contact.uid);
				console.log(currentUser);

			var newContact = {};

			newContact.email = currentUser.email;
			newContact.uid = currentUser.uid;
			newContact.firstName = currentUser.firstName;
			newContact.lastName = currentUser.lastName;

				console.log(newContact);

			ref.child('users').child(user).child('contacts').child(contact.uid).set(contact);

			ref.child('users').child(contact.uid).child('contacts').child(contact.uid).set(newContact);

			ref.child('users').child(user).child('requests').child(contact.uid).remove();
				//ref.child('users').


		},

		searchEmail: function(email) {
			
			usersRef.startAt(email).endAt(email)
				.once("value", function(snap) {
					snap.forEach(function(user) {
						var sUID = user.key();
						//console.log("hello",sUID);
						Contacts.sendRequest(sUID);
					});
				});
		},

		sendRequest: function(contactUID) {
			var currentUser = Auth.user.userData;
			var requestBy = {};

//			console.log(currentUser.userData);

			requestBy.uid = currentUser.$id;
			requestBy.email = currentUser.email;
			requestBy.firstName = currentUser.firstName;
			requestBy.lastName = currentUser.lastName;

			console.log(requestBy);

			console.log(contactUID);

			return ref.child('users').child(contactUID).child('requests').child(requestBy.uid).set(requestBy);



		}
	};

	return Contacts;


});
