<?
/*

Form Renderer Class

Made for easy HTML form generation
*/

function forms_doPostField($collectionId=0, $isGroup=false)
{
	/*
		Warning: Do not edit the DOM structure here as it is used by 
		click event of .but_postCol in javascript file page.js

		If you want to edit the DOM struture you will have to edit
		this file too.
	*/

fw_load("attachment");
$atf = new attachmentForm("atf_stream_".$collectionId);

echo "<div>";
	if ($isGroup)
		echo "<input type='hidden' name='groupid' value='$collectionId'>";
	else
		echo "<input type='hidden' name='groupid' value=''>";

	echo "<textarea class='box' style=' width:100%;'></textarea>".$atf->printContainer()."
<div style='margin-top:8px;'><a type='button' class='button but_postCol' value='Post'>Post</a>";


	if ($collectionId == 0)
	{


	echo " in 
	<select>";

$colls = getCollections($_SESSION["charme_user"]);
foreach ($colls as $item)
echo "<option value='".$item["_id"]."'>".$item["name"]."</option>";

	echo "</select>
	";
	}
  echo " - ".$atf->printAdd()." <br class='cb'></div></div>";

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

/*
People with visible  selector
Value has form: "[$]id1,id2" where [$] is visibility type (1,2,3) and id starts with p for person or l for list
Example: 2pschuldie@localhost,ltest contains user id schuldie@localhost and list test with type 2
*/
class formPeople extends form
{
	public function render() {



	if ($this->val == "")
		$this->val = "1"; //default is public!

		$val2 = substr($this->val, 1);
		$mylists = explode(",",$val2);




		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
		//1. getmylistnames

		$listnames = array();
		$licur = getLists($_SESSION["charme_user"]);

		// Get all lists of user
		foreach ($licur as $item)
		{
			$listnames[(string)$item["_id"]] = $item["name"] ;
		}

		$json = array();
		foreach ($mylists as $item) {
			//TODO: if startswith p -> person, if startswith l-> list
			//echo  $item;
			if (strlen($item) > 0)
			{
				$realid= substr($item, 1);
				
				if ($item{0} == "l" && isset($listnames[$realid]))
				{

					$json[] = array("name"=>  $listnames[$realid] , "id"=>$item);
				}
				else if ($item{0} == "p")
				{

					$json[] = array("name"=> $realid , "id"=>$item);
				}
			}
		}
	
	//	print_r($json);

		//make json, JSON is added to list by ui_userselect() in lib/ui.js 
	$json = json_encode($json);
	

        $str =  "<tr><td class='tdinfo'>".$this->name.":</td><td><select  name='".$this->fid."' style='margin-bottom:4px;' class='box userSelectSwitcher'>";
        $str .= ($this->val{0} == 1) ? "<option selected='selected' value='1'>Public</option>" : "<option value='1'>Public</option>";
		$str .= ($this->val{0} == 2) ? "<option selected='selected' value='2'>People in my lists</option>" : "<option value='2'>People in my lists</option>";
		$str .= ($this->val{0} == 3) ? "<option selected='selected' value='3'>Specify...</option>" : "<option value='3'>Specify...</option>";


        $str .= "</select><input type='hidden' class='res' name='people_res_".$this->fid."'><div class='spec'><input class='userSelect' data-styp='".$this->val{0}."' type='hidden' name='people_".$this->fid."' data-json='".$json."'></div></td></tr>";
        return $str;
    }
}

/*
Only People
*/
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


class formPass extends form
{
	public function render() {
	
        return "<tr><td class='tdinfo'>".$this->name.":</td><td><input class='box' type='password' name='".$this->fid."' value='".$this->val."'></td></tr>";
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