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
		$('#collection_container').append(d).show();

		initPage(0);
	});
}

function initProfile()
{
	$('#select_lists a').click(function(){
	$(this).toggleClass("active");
	$.doTimeout( 'listsave', 1000, function( state ){



	
		
var ar = $('#select_lists a.active').map(function(i,n) {
        return $(n).data("listid");
    }).get();

var uid = $.urlParam("userId",location.href );

 $.post("ui/actions/modList.php", {'ar[]': ar, userId: uid}, function(d) {
        alert(d); 
    });


	/*	$('#select_lists a.active').each (function(index)
		{
			ar.push(($(this).data("listid")));
		})*/





	}, true);
	});

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

if ($('#files').length)
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
$(".collectionBg").prepend("<div class='collectionImgbox'></div>");




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
else
	$(".collectionBg .collectionImgbox").first().prepend(xhr.responseText);
				//alert(xhr.responseText);




				}
			};

			xhr.send(formData);
 
}  