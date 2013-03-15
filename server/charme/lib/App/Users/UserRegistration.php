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

		$collection->insert($obj);*/
		return json_encode(array("test" => true));
	}
}

?>