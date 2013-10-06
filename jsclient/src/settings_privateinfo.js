var view_settings_privateinfo = view_subpage.extend({


	events: {


	},
	getData: function()
	{
		return this.options.data;
	},
	initialize: function() {

	},
	postRender: function() {

		// Attach SaveButton click event.
		$("#but_savePrivateProfile").click(function() {

			NProgress.start();

			var fields =

			{
				phone: encryptField($("input[name=phone]").val()),
				currentcity: encryptField($("input[name=currentcity]").val()),
				mail: encryptField($("input[name=mail]").val()),
			};

			apl_request({
				"requests": [{
					"id": "piece_store",
					"fields": fields
				}, ]
			}, function(d) {

				NProgress.done();
			});
		});
	}
});

function encryptField(fieldvalue) {

	var aes = randomAesKey(32);
	var value = aes_encrypt(aes, fieldvalue);
	var rsakey = getCurrentRSAKey();

	var aesEnc = rsakey.rsa.encrypt(aes);

	return {
		aesEnc: aesEnc,
		value: value,
		revision: rsakey.revision
	};
}