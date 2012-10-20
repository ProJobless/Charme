<?
class attachmentForm
{
	var $fid;
	function attachmentForm($fid)
	{
		$this->fid=$fid;
	}
	function printAdd()
	{
		//TODO: Make sure file input value is not submitted in forms!
		return "<a id='".$this->fid."' onclick='ui_attach(this)'>Add Attachment</a>".
		'<input style="display:none" type="file" id="files" name="files[]" multiple />';

	}
	function printContainer()
	{
		return "<div class='attachmentContainer' id='attachments".$this->fid."'></div>";
	}
}
?>