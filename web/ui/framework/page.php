<?
	
	
function page_init($title, $layout=0)
{
	echo "<div class='meta' title='page_title'>".$title."</div>";
	echo "<div class='meta' title='page_layout'>".$layout."</div>";
	
	
}
function getSubMenuItem($title, $href, $count, $isActive=false)
{
	
}
function actionBarSet($items)
{
	echo "<div class='meta' title='action_bar'>".$items."</div>";
}
function subMenuAdd($items)
{
	$str = "";
	foreach ($items as $item)
	$str .= $item;
	
	echo "<div class='meta' title='submenu_items'>".$str."</div>";

	
}
function subMenuActionAdd($title, $par)
{	

	
		return "<li><a ref='$par'>$title</a></li>";
}
function page_addCSS()
{
	
}
function page_addJS()
{
	
}
?>