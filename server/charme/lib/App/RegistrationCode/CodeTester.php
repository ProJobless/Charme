<?php
/**
* 	You can replace this class by you own class to enable Registration codes.
*/

namespace App\RegistrationCode;


class CodeTester
{
	function __construct($code)
	{
		// Here you write your own Registration Code Tester
		// return false if code is invalid
		return true;

	} 
}
?>