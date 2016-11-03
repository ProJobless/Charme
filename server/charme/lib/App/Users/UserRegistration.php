<?php
namespace App\Users;


class UserRegistration implements \App\Models\Action
{
	 private $data;
	function __construct($d)
	{
		$this->data = ($d);

	}
	function execute()
	{
		global $CHARME_SETTINGS;
		// Access Attributes over $_GET[formname]

		$data = $this->data;

		/*$m = new Mongo();
		$db = $m->charme;
		$collection = $db->users;


		$collection->insert($obj);
		*/
		$arr= array("test" => true);



	 $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			    $randomString = '';
			    for ($i = 0; $i < 32; $i++) {
			        $randomString .= $characters[rand(0, strlen($characters) - 1)];
			    }




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

		 if (strlen($data["username"]) < 2 || strlen($data["username"]) >30)
			$arr["error"] = 3;
		else if ($data["rsa"] == "" || !isset($data["rsa"] ))
			$arr["error"] = 6;
		if ($data["pubkey"]  == "") // Has to be tested AFTER rsa key test.
			$arr["error"] = 13;
		else
		{
			// Insert user into database...
			$arr["success"] = 1; // Registration was successful!

			$obj = array(
			"username" => $data["username"],
			"password"=>$data["hashpass"],
			"userid" => $data["username"]."@".$data["server"],
			"email" => $data["email"],
			"firstname" => $data["firstname"],
			"signedData" => $data["signedData"],
			"lastname" =>$data["lastname"],
			"name" => $data["firstname"]." ".$data["lastname"],
			"salt" => $randomString,
			"publickey" => json_decode($data["pubkey"], true), // Unencrypted public key
			"keyring" => $data["rsa"] // Encrypted AES keyring
		);
			$col = \App\DB\Get::Collection();

			$col->users->insert($obj);

			$col->localkeydirectory->insert(
				array(
					"userid" => $data["username"]."@".$data["server"],
					"publicKey" =>  json_decode($data["pubkey"], true),
					"revision" => 1,
					"pemkey" => $data["pemkey"]
					));

			// Set session Id
			$_SESSION["charme_userid"] =  $data["username"]."@".$data["server"];

			// Create some default lists
			$friendListId = \App\CRUD\Lists::CreateList("Friends",$_SESSION["charme_userid"] );
			clog("frid list".$friendListId);

			$colleagues = \App\CRUD\Lists::CreateList("Colleagues",$_SESSION["charme_userid"] );
			$fellow = \App\CRUD\Lists::CreateList("Fellow students",$_SESSION["charme_userid"] );

			\App\CRUD\Filter::CreateFilterWithList($_SESSION["charme_userid"] , "offer", "Local Shop", array($friendListId, 	$colleagues, 	$fellow), "This filter shows things your friends and colleagues give away. You can create your own filters by clicking on the plus symbol. ");
			\App\CRUD\Filter::CreateFilterWithList($_SESSION["charme_userid"] , "activities", "Activities", array($friendListId),"This filter shows your friends activities. You can create your own filters by clicking on the plus symbol. ");

			\App\CRUD\Collections::Insert($_SESSION["charme_userid"] , "Things about me (Public)", "Selfies, Stories and mor of me");
			\App\CRUD\Collections::Insert($_SESSION["charme_userid"] , "Music and Videos I like (Public)", "Stuff I like so far...");


		}


		return ($arr);
	}
}

?>
