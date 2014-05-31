Concept:

Save all outgoing messages with PrepareMessage(messageJSON, Priority, Tries) in collection outbox first.
Call ->Postman() to send out messages. ->Postman() is called via Cronjob and/or via seperate process.

Use
exec("doTask.php $arg1 $arg2 $arg3 >/dev/null 2>&1 &");
to start seperate process.