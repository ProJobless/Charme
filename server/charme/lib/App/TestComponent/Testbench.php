<?php
namespace App\TestComponent;

//use App; //If not added, then new App\Users\UserRegistration("") will not load

class Testbench implements \App\Models\Action
{
	function __construct()
	{
		echo "test ok";
		//$helloWorld = new App\Users\UserRegistration("");

	} 
	function execute($r)
	{
	return "";
	}
}


/*
Extending: 

class MyClass extends \MyLibrary\MyComponent\MyClass

class MyClass extends \core\MyComponent\MyClass
*/

?>