function saveProfile()
{


$.post("ui/actions/saveProfile.php", $('#form_profile').serialize(), function(d){
		alert(d);

	});




}

function savePrivacy()
{

	
	console.log($('.userSelect:first').serialize());





$.post("ui/actions/savePrivacy.php", $('#privacyForm').serialize(), function(d){
		alert(d);

	});

}