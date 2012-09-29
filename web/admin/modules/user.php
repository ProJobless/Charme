<?

$helparray["user"] = "[[bu;#09C;#000]User Managment]
useradd 
userdel     
userdelall
userlist
userinfo";

$helparray2["useradd"] = array("String username, String email, String servername, String password, String firstname, String lastname", "Adds an user with the specified parameters.");
$helparray2["useradd"] = array("", "View all users.");
 
function charme_admin_useradd($username, $email, $servername,$password, $firstname,$lastname )
{
	require('../apl/usermanager/register.php');
	addUser($username, $email, $servername,$password, $firstname,$lastname );
}

// UserID:String\n[[i;#444;#000]information about user]string userID\n[[i;#444;#000]Delete a user]

function charme_admin_protected_userdelall($x)
{
	if ($x=="y")
	{
		include_once($_SERVER['DOCUMENT_ROOT']."/config.php");
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->users;
	
	$collection->remove();
echo "Deleted all Users.";
		
	}
	else
	echo "Operation canceled.";
}
function charme_admin_userlist()
{
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->users;
	echo "INDEX INFO: \n";
	print_r( $collection->getIndexInfo ());
		echo "USER: \n";
	
	$cursor = $collection->find();

	foreach ($cursor as $obj) {
		print_r($obj);
		//echo $obj["username"] . "\n";
	}	
}
function charme_admin_userdelall()
{
	echo "[[b;#f00;#000]Delete ALL (!) Users? Type y for continue.\nWARNING: THIS OPERATION CAN NOT BE UNDONE!!!]";


	$_SESSION["admin_nextfunction"] = "userdelall";
	$_SESSION["admin_arguments"] = "";
	
	

}
	
function charme_admin_userdel($x)
{
	echo "[[b;#f00;#000]Delete User $x? Type y for continue.]";


	$_SESSION["admin_nextfunction"] = "userdel2";
	$_SESSION["admin_arguments"] = $x;
}
function charme_admin_userinfo($x)
{
	echo "[[b;#fff;#000]Info for $x]\nName: Hello\n";


	
}
function charme_admin_protected_userdel2($x)
{
	if ($x=="y")
	echo "User was deleted.";
	else
	echo "Operation canceled.";
}
?>