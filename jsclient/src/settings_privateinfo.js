var view_settings_privateinfo= view_subpage.extend({


 events: {


  },
  initialize: function()
  {

  },
  postRender: function()
  {

  		// Attach SaveButton click event.
  		$("#but_savePrivateProfile").click(function(){
  			alert($("input[name=phone]").val());
  		});
  }

	

});

function encryptField(fieldname, fieldvalue)
{
	var aes = randomAesKey(32);
	var value = aes_encrypt(aes, fieldvalue);
	var aesEnc = getCurrentRSAKey().encrypt(aeskey);

	return { aesEnc: aesEnc, value: value };
}