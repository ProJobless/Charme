<?
/*

Form Renderer Class

Made for easy HTML form generation
*/

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

	function setVal($value)
	{
		$this->val=$value;
	}
	function getId()
	{
		return $this->fid;
	}
	function form($fid, $name="", $val="")
	{
		$this->name=htmlspecialchars($name);
		$this->fid=$fid;
		$this->val=htmlentities($val, ENT_COMPAT, "UTF-8");
	}
	  public abstract function render();
}
class formSplit extends form
{
	public function render() {
		        return "<tr><td class='tdinfo'></td><td>&nbsp;</td></tr>";//$this->val
	}
}
class formHTML2 extends form
{
	public function render() {
		        return "<tr><td class='tdinfo'></td><td>".$this->fid."</td></tr>";//$this->val
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
	var $options = array();
	public function addOption($did,$name)
	{
		$this->options[$did] = $name;
	}
	public function render() {
	
		$optstr = "";

		foreach ($this->options as $key => $name)
		{

			if ($key == $this->val)
			{
				$optstr  .= "<option selected=\"selected\" value='".$key."'>$name</option>";
			}
			else
			$optstr  .= "<option value='".$key."'>$name</option>";
		}

        return "<tr><td class='tdinfo'>".$this->name.":</td><td><select name='".$this->fid."' >".$optstr ."</select></td></tr>";//$this->val
    }
}

class formCity extends form
{
	public function render() {
	
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><input class='box' type='text' name='".$this->fid."' value='".$this->val."'></td></tr>";
    }
}

class formPeople extends form
{
	public function render() {

		$val2 = substr($this->val, 1);
		$mylists = explode(",",$val2);

		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
		//1. getmylistnames

		$listnames = array();
		$licur = getLists($_SESSION["charme_user"]);
		foreach ($licur as $item)
		{
			$listnames[(string)$item["_id"]] = $item["name"] ;
		}

		$json = array();
		foreach ($mylists as $item) {
			//TODO: if startswith p -> person, if startswith l-> list

		if (isset($listnames[$item]))
			$json[] = array("name"=>  $listnames[$item] , "id"=>$item);


		}
		//make json
		$json = json_encode($json);

        $str =  "<tr><td class='tdinfo'>".$this->name.":</td><td><select  name='".$this->fid."' style='margin-bottom:4px;' class='box userSelectSwitcher'>";
        $str .= ($this->val{0} == 1) ? "<option selected='selected' value='1'>Public</option>" : "<option value='1'>Public</option>";
		$str .= ($this->val{0} == 2) ? "<option selected='selected' value='2'>People in my lists</option>" : "<option value='2'>People in my lists</option>";
		$str .= ($this->val{0} == 3) ? "<option selected='selected' value='3'>Specify...</option>" : "<option value='3'>Specify...</option>";


        $str .= "</select><input type='hidden' class='res' name='people_res_".$this->fid."'><div class='spec'><input class='userSelect' data-styp='".$this->val{0}."' type='hidden' name='people_".$this->fid."' data-json='".$json."'></div></td></tr>";
        return $str;
    }
}


class formPeople2 extends form
{
	public function render() {

		$val2 = substr($this->val, 1);
		$mylists = explode(",",$val2);

	

        $str =  "<tr><td class='tdinfo'>".$this->name.":</td><td style='position:relative'>";
      


        $str .= "<input class='userSelect2'  type='hidden' name='".$this->fid."'></td></tr>";
        return $str;
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
	var $keys;
	public function getKeys()
	{
		return $this->keys;
	}
	function formCollection()
	{
		$this->forms=array();
	}
	public function contains($name)
	{
	
		foreach ($this->forms as $key => $item)
			{
			
				//$item = $value;//;$this->forms[$key];

		


				if ($item->getId() == $name)
					return true;
			}

	 	return false;
	}
	public function fillFromArray($arr)
	{
		foreach ($this->forms as $key => $value)
		{
			$item = $this->forms[$key];

			if (isset($arr[$item->getId()]))
			{
				$item->setVal($arr[$item->getId()]);


			//echo "VALUE".$arr[$item->getId()];

			}


		}

	}
	public function add($item)
	{
		$this->keys[] = $item->getId();
	 	$this->forms[] = $item;
	}
	public function printOut($url, $submit = true, $ajax = "", $formId="")
	{
		
		echo "<form id='$formId' action='$url' method='post'><table cellspacing=0 cellpadding=0>";
		foreach ($this->forms as $item)
		{
			echo "".$item->render()."";
			
			// print_r( $item);//->render;
			
		}
			//echo "";  
			
			if ($submit)
			{
				echo "<tr><td></td><td><input style'margin-top:8px;' class='button' type='submit' value='Save'></td></tr>";
			}
			if ($ajax != "")
			{
				echo "<tr><td></td><td><a style'margin-top:8px;' class='button' href='javascript:$ajax' type='submit'>Save</a></td></tr>";
			}

			echo "</table>";
			echo "</form><div id='error'></div>";	  
	}	
}
?>