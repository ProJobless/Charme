var view_settings_privateinfo_requests = view_subpage.extend({
	postRender: function()
	{

			$(".btnDecline").click(function() {
				var that = this;

				// TODO: server request
					$(that).parent().parent().remove();
			});


		// Attach click events
		$(".btnAccept").click(function() {

			var that = this;
			var key = ($(this).parent().data("key"));
			var userid = ($(this).parent().data("userid"));

			// Generate Random AES, this key will be sued if a new Bucket is created.
			var mykey  = randomAesKey(32);

			// Encrypt AES Key with fastkey1
			var fastkey = getFastKey(0, 1);
			var aesEnc = aes_encrypt(fastkey.fastkey1, mykey);


			/// APL GET AES HERE!

			
			apl_request({
				"requests": [{
					"id": "piece_request_accept",
					"aesEnc": aesEnc,
					"userid" : userid,
					"key" : key
				}, ]
			}, function(d) {
				$(that).parent().parent().remove();
			});


		});
	},
	getData: function()
	{
		return this.options.data;
	}
});


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
	var fkey = getCurrentFastKey(1);

	var aesEnc = aes_encrypt(fkey.fastkey1, aes);

	return {
		aesEnc: aesEnc,
		value: value,
		revision: fkey.revision
	};
}