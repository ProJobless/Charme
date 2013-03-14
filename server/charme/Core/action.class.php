<?
namespace Core;

interface action
{
	public function setVariable($name, $var);
	public function getHtml($template);
}
?>