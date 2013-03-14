<?php
namespace App\TestComponent;

use App;

class Testbench  //extends \MyLibrary\MyComponent\MyClass
{
	function __construct()
	{
		echo "test ok";
	} 
	function getHTTML($r)
	{
		return ";";
	}
}


/*
Extending: 

class MyClass extends \MyLibrary\MyComponent\MyClass

class MyClass extends \core\MyComponent\MyClass
*/

?>