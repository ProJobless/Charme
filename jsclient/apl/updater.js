/*
	Updater:
	Will be called in certain intervals and looking for new updates

	important functions:


	Send to server: latestNewsFeedId (0 is no posts stored), md5 of all lists, 
	Return: newsfeed, lists, 

	Local Database:
	http://www.tutorialspoint.com/html5/html5_web_sql.htm

	- Stream Table: owner, listid, json
	- List Table: owner, uid, list

*/


// Check every minute
$.doTimeout( 'getnotify', 1000*60*5, function(){
		
	getNotifications();
	return true; // return false to cancel loop


	/* Put into HTML5 WebStorage */

	var testObject = { 'one': 1, 'two': 2, 'three': 3 };

// Put the object into storage
localStorage.setItem('testObject', JSON.stringify(testObject));

// Retrieve the object from storage
var retrievedObject = localStorage.getItem('testObject');

console.log('retrievedObject: ', JSON.parse(retrievedObject));

});
