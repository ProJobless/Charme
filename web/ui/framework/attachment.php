<?
/*
Class provides a gui for attachments
Javascript functions can be found in ui.js
*/
class attachmentForm
{
	var $fid; // Must be unique for every attachment
	function attachmentForm($fid)
	{
		$this->fid=$fid;
	}
	function printAdd()
	{

		//TODO: Make sure file input value is not submitted in forms!
		return "<a id='".$this->fid."' onclick='ui_attach(this)'>Add Attachment</a>".
		'<input style="display:none" type="file" id="fileinput'.$this->fid.'"" name="files'.$this->fid.'[]" multiple />';

	}
	function printContainer()
	{
		return "<div class='attachmentContainer' id='attachments".$this->fid."'></div>";
	}
}
?>