<?
namespace App\Users;


class UserRegistration implements \App\Models\Action
{
	
	function __construct()
	{
		//$this->data = json_decode($d);

	} 
	function execute()
	{
		global $CHARME_SETTINGS;
		// Access Attributes over $_GET[formname]
	
		

		/*$m = new Mongo();
		$db = $m->charme;
		$collection = $db->users;

	
		$collection->insert($obj);
		*/
		$arr= array("test" => true);
	


		/**
		*		Error codes, see jsclient/templates/signup.html:
		*
		*		<div id='error1'>Invalid Registration Code</div>
		*		<div  id='error2'>Invalid characters in username</div>
		*		<div  id='error3'>Username lenght must be between 2 and 30 characters</div>
		*
		*		<div id='error4'>Password lenght must be between 10 and 30 characters</div>
		*		<div id='error5'>Password contains illegal characters</div>
		*		<div id='error6'>Please create a certificate</div>
		*
		*		<div id='error7'>Invalid mail address</div>
		*
		*		<div id='error8'>Invalid server</div>
		*
		*		<div  id='error9'>Name must have between 2 and 30 characters and should not contain special characters</div>
		*
		*		<div  id='error10'>Please accept the terms.</div>
		*		<div  id='error11'>Outdated Charme Client Version. Please update your client software.</div>
		*		error 12: password do not match
		*/

		/**
		* Validation part:
		*/

		if ($_GET["password"] != $_GET["password2"])
			$arr["error"] = 12;
		else if (strlen($_GET["password"]) < 10 || strlen($_GET["password"]) >30)
			$arr["error"] = 4;
		else if ($_GET["rsa"] == "" || !isset($_GET["rsa"] ))
			$arr["error"] = 6;
		if ($_GET["pubkey"]  == "") // Has to be tested AFTER rsa key test.
			$arr["error"] = 12;
		else
		{
			// Insert user into database...
			$arr["success"] = 1; // Registration was successful!
			
			$obj = array(
			"username" => $_GET["username"],
			"password"=>md5($CHARME_SETTINGS["passwordSalt"].$_GET["password"]),
			"userid" => $_GET["username"]."@".$_GET["server"],
			"email" => $_GET["email"],
			"firstname" => $_GET["firstname"],
			"lastname" =>$_GET["lastname"],
			"pubKey" => $_GET["pubkey"]
		);
			$col = \App\DB\Get::Collection();

			$col->users->insert($obj);
		}


		return json_encode($arr);
	}
}

?>