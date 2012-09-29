<?php
session_start();


$helparray =array("Type 'help command' to get information about a specified command.
You have installed the following modules:
");
$helparray2 =array();
foreach (glob("modules/*.php") as $filename)
{
    include $filename;
}
//echo "You typed".$_POST["command"];

$cmdarray = split(' ', $_POST["command"]);
$command =  array_shift($cmdarray) ;

if ($_SESSION["admin_nextfunction"] != "")
{
	$funcbefore = $_SESSION["admin_nextfunction"];
	call_user_func ("charme_admin_protected_".$_SESSION["admin_nextfunction"],$_POST["command"]);
	
	if ($funcbefore == $_SESSION["admin_nextfunction"])
	{
	$_SESSION["admin_nextfunction"] = "";
	$_SESSION["admin_arguments"]  = "";
	}
}
else
{



if (!function_exists ("charme_admin_".$command))
echo "Function ".$command." does not exist.";
else
call_user_func_array ("charme_admin_".$command,$cmdarray);

}
/*
class CharmeAdmin {


  static $login_documentation = "login to the server (return token)";
  public function login($user, $passwd) {
    if (strcmp($user, $this->userLogin) == 0 && strcmp($passwd, $this->passLogin) == 0) {
      
	  
      return md5($user . ":" . $passwd);
    } else {
      throw new Exception("Login failed");
    }
  }
 var $userLogin = "demo2";
 var $passLogin = "demo";
  function checkToken($token)
  {
	if (strcmp(md5( $this->userLogin.":". $this->passLogin), $token) == 0)
	  return true;return false;
  }
  
    static $lsuser_documentation = "Get User list [filter, start]";
  public function lsuser($token, $filter="", $start="") {
	   if ($this->checkToken($token))
	  {
		  return listUsers("");
	  }
	  
  }

  static $deleteUser_documentation = "Delete a user, Arguments: UserId";
  public function deluser($token, $user="") {
	  
	  if ($this->checkToken($token))
	  {
	  if ($user =="")
	  return "Invalid Argument #1";
	  
	  return "Are you sure to remove [[;#0f0;]".$user."]? All user data will be deleted forever. Type y to Proceed.";
  }}
  
  
  static $ls_documentation = "list directory if token is valid";
  public function ls($token, $path) {
    if ($this->checkToken($token)) {
      if (preg_match("/\.\./", $path)) {
        throw new Exception("No directory traversal Dude");
      }
      $base = preg_replace("/(.*\/)./", "$1", $_SERVER["SCRIPT_FILENAME"]);
      $path = $base . ($path[0] != '/' ? "/" : "") . $path;
      $dir = opendir($path);
      while($name = readdir($dir)) {
        $fname = $path."/".$name;
        if (!is_dir($name) && !is_dir($fname)) {
          $list[] = $name;
        }
      }
      closedir($dir);
      return $list;
    } else {
      throw new Exception("Access Denied");
    }
  }
  static $whoami_documentation = "return user information";
  public function whoami() {
    return array("your User Agent" => $_SERVER["HTTP_USER_AGENT"],
                 "your IP" => $_SERVER['REMOTE_ADDR'],
                 "you acces this from" => $_SERVER["HTTP_REFERER"]);
  }
}

handle_json_rpc(new CharmeAdmin());
*/
?>