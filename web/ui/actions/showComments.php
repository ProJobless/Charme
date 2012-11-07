<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/groups/groups.php");
needSession();


fw_load("post");
echo "<a class='more'>More...</a>";
echo comment_format("test@test.de", "Someone" ,"Hey du!!!", time());
echo comment_format("test@test.de", "Someone" ,"Hey du!!!", time());
echo comment_format("test@test.de", "Someone" ,"Hey du!!!", time());


?>
