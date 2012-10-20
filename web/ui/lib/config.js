function saveProfile()
{


$.post("ui/actions/saveProfile.php", $('#form_profile').serialize(), function(d){
		alert(d);

	});


}
function savePassword()
{


$.post("ui/actions/savePassword.php", $('#form_pass').serialize(), function(d){
		alert(d);

$('#form_pass input').val("");
	});


}
function saveAccount()
{


$.post("ui/actions/saveAccount.php", $('#accountForm').serialize(), function(d){
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