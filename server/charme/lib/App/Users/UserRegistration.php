<?
namespace App\Users;


class UserRegistration implements \App\Models\Action
{
	var $data;
	function __construct($d)
	{
		$this->data = json_decode($d);

	} 
	function execute()
	{
	
		print_R($this->data);

		/*$m = new Mongo();
		$db = $m->charme;
		$collection = $db->users;

		$obj = array(
			"username" => $this->user["username"],
			"password"=>md5($CHARME_SETTINGS["passwordSalt"].$this->user["password"]),
			"userid" => $username."@".$CHARME_SETTINGS["serverURL"],
			"email" => $email,
			"firstname" => $firstname,
			"lastname" => $lastname
		);
		$collection->insert($obj);
		*/
		$arr= array("test" => true);
		/* Error codes, see jsclient/templates/signup.html:

		<div id='error1'>Invalid Registration Code</div>
		<div  id='error2'>Invalid characters in username</div>
		<div  id='error3'>Username lenght must be between 2 and 30 characters</div>

		<div id='error4'>Password lenght must be between 10 and 30 characters</div>
		<div id='error5'>Password contains illegal characters</div>
		<div id='error6'>Please create a certificate</div>

		<div id='error7'>Invalid mail address</div>

		<div id='error8'>Invalid server</div>

		<div  id='error9'>Name must have between 2 and 30 characters and should not contain special characters</div>

		<div  id='error10'>Please accept the terms.</div>
		<div  id='error11'>Outdated Charme Client Version. Please update your client software.</div>
	error 12: password do not match
		*/

		//$arr["error"] = 2;

if ($this->data["password1"] != $this->data["password2"])
$arr["error"] = 12;
else if ($this->data["rsa"] == "" || !isset($this->data["rsa"] ))
$arr["error"] = 6;
		else
$arr["success"] = 1; // Registration was successful!
	
		return json_encode($arr);
	}
}

?>