<?


function forms_doPostField($collectionId=0)
{
	echo "<div><textarea class='box' style='margin-bottom:8px; width:100%;'></textarea>
<a type='button' class='button but_postCol' value='Post'>Post</a> in
<select>
<option>Private</option>
<option>+ Art</option>
<option>+ Music</option>
<option>&nbsp;&nbsp;&nbsp;&nbsp;+ Dubstep</option>
<option>Public</option>
<option>+ Art</option>
<option>+ Music</option>


</select>
  - <a href='javascript:makeAttachment()'>Add Attachment</a> <br class='cb'></div>";

}
	
abstract class form
{
	var $val;
	var $fid;
	var $name;
	
	function form($fid, $name="", $val="")
	{
		$this->name=htmlspecialchars($name);
		$this->fid=$fid;
		$this->val=htmlentities($val, ENT_QUOTES, "UTF-8");
	}
	


	  public abstract function render();
}
class formSplit extends form
{
	public function render() {
		        return "<tr><td class='tdinfo'></td><td>&nbsp;</td></tr>";//$this->val

	}
}
class formHTML extends form
{

		
	public function render() {
		        return "</table>".$this->fid."<table cellspacing=0 cellpadding=0>";//$this->val

	}
}
class formDrop extends form
{
	var $options = "";
	public function addOption($did,$name)
	{
		if ($did == $this->val)
		{
			$this->options .= "<option selected=\"selected\" value='".$did."'>$name</option>";
			
		}
		else
		$this->options .= "<option value='".$did."'>$name</option>";
		
	}
	public function render() {
	
	
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><select name='".$this->fid."' >".$this->options."</select></td></tr>";//$this->val
    }
}


class formText extends form
{
	public function render() {
	
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><input class='box' type='text' name='".$this->fid."' value='".$this->val."'></td></tr>";
    }
}
class formArea extends form
{
	public function render() {
	
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><textarea  class='box'  name='".$this->fid."'>".($this->val)."</textarea></td></tr>";
    }
}

class formHidden extends form
{
	public function render() {
	
        return "<input  type='hidden' name='".$this->fid."' value='".$this->val."'>";
    }
}

class formCheck extends form
{
	public function render() {
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><input type='checkbox' name='".$this->fid."' value='".$this->val."'></td></tr>";
    }
	
}



class formCollection
{
	var $forms;
	function formCollection()
	{
		$this->forms=array();
	}
	
	public function add($item)
	{
	 	$this->forms[] = $item;
	}
	public function printOut($url, $submit = true, $ajax = false)
	{
		
		echo "<form  action='$url' method='post'><table cellspacing=0 cellpadding=0>";
		foreach ($this->forms as $item)
		{
			echo "".$item->render()."";
			
			// print_r( $item);//->render;
			
		}
			//echo "";  
			
			if ($submit)
			{
				echo "<tr><td></td><td><input style'margin-top:8px;' class='button' type='submit' value='Speichern'></td></tr>";
			}
			echo "</table>";
			echo "</form><div id='error'></div>";
			
			  
	}	
}
?>