<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
fw_load("page");


subMenuAdd(
array(
subMenuActionAdd("Following ", "1"),
subMenuActionAdd("Followers ", "2"),
subMenuActionAdd("List 2", "3"),
subMenuActionAdd("List 3", "4"),

)
);
//Default cricles: Friends, Acquaintances, Colleauges


page_init("Stream", 1);
?>Add friend from URL