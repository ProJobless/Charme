When creating a new conversation, we do the following steps:

1. Request edgekeys from reciever servers
2. Create a unique messageKey, encrypt it with the edgekey and send it to all receiver servers where it is stored in the `messageKeys` collection.
3. 

When writing a message we execute this steps:
1. Create Message Object, make Siganture

When removing a user:
1. Create New messageKey for all users except the removed user.
2. Distribute Keys
3. Send remove_user to the users server

Adding a User:
1. Create new message key for all users including the new user




Javascript Functions:




Implemenation Steps:
1. get edkgey, make postkey
2.


Security:
1. The receiver list must be hashed with message key and checked before a new key is distributed.
	otherwise:
	0. message with user A and B
	1. evil server of user A adds user C (normally only user a can add)
	2. user B adds user D and distributes message key to A B C (C is evil) and D.


message_distribute:
	action:
		addPeople
		message (default)
		initConversation
		removePeople/leave


Things to sign:
