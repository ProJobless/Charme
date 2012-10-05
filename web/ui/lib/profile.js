function but_addCollection()
{
	$.post("ui/actions/newCollection.php", function(d){
	ui_showBox(d+ui_Button("Add Collection", "addCollection()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}

function postIntoCollection()
{
//var c = 
}

function addCollection()
{
	//Serialize Form
	//1: get form by id, 2. form.serialize
	var x = $.urlParam("id",location.href );
	x = (x=="") ?  "0" : x;
	$.post("ui/actions/newCollection.php?id="+x, $('.fixedBox form').serialize(), function(d){
		ui_closeBox();
		alert(d);
	});
}

function initProfile()
{
	$('.but_postCol').click(function(){ 

		var v = ($(this).parent().children("textarea").val());
		var x = $.urlParam("id",location.href );
		x = (x=="") ?  "0" : x;
		$.post("ui/actions/doPost.php?id="+x, {content:v}, function(d)
		{
			alert(d);
		});
	});

	$(".switch").hide();
$(".switch1").show();


$(".switcher").click(function(){
$(".switch").hide();
	$(".switch"+$(this).data("pos")).show();
});




	document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {

    	//TODO:CHECK IF IMAGE!
    	  UploadFile(f);  
    }

   // $('.photodrop > .list') .append('<ul>' + output.join('') + '</ul>');
  }
function getCollectionId()
 {

 	var x = $.urlParam("id",location.href );
	return  (x=="") ?  "0" : x;
 }
  function UploadFile(file) {  
   



   var xhr = new XMLHttpRequest();
	xhr.open("POST", "ui/actions/uploadImageFile.php?collection="+getCollectionId(), true); 

	var formData = new FormData();
formData.append("pic", file);


    xhr.setRequestHeader("X_FILENAME", file.name);  

	xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					if (xhr.status != 200)
						alert("Error uploading file.");

				alert(xhr.responseText);
				}
			};

			xhr.send(formData);
 
}  