/*
	Layout definitions of pages like Profile, Stream etc.
*/



CharmeModels = {} // CoffeScript Namespace

/***
	Name:
	exampleFunction

	Info:
	This function is located on top in page_modules.js and shows how to use the Charme Documentation. You can use `Markdown` for descriptions and Mermaid for diagrams.

	Params:
	address:type:Some address

	Graph:
	graph LR
	    A[Square Rect] -- Link text --> B((Circle))
	    A --> C(Round Rect)
	    B --> D{Rhombus}
	    C --> D

	Code:JS:
	alert("") // Some javascript Code. You can also use Code:PHP for PHP Code.
*/

function exampleFunction() {

}


// Extend close function to remove events!
Backbone.View.prototype.close = function() {


  /* if (this.onClose) {
        this.onClose();
    }
    this.remove();
    this.undelegateEvents();*/
}

/***
	Name:
	sendMessageForm

	Info:
	Generate a new message box with the specified receivers

	Params:
	receivers:JSON Object:Receiver list in format [{id: 'alice@myserver.com', name: 'Alice'},{id: "bob@myserver.com", name: "Bob"}]
	Location:
	apl/page_modules.js

	Code:JS:
	// Send a message to Alice
	sendMessage(Form(
		[
			{id: 'alice@myserver.com', name: 'Alice'}
		]);)
*/

function sendMessageForm(receivers) {

  $.get("templates/box_messageForm.html", function(d) {

    var templateData = {
      receivers: receivers
    };

    _.templateSettings.variable = "rc";
    var template = _.template(d, templateData);

    ui_showBox(template, function() {
      $("#token-input-inp_receivers").focus();
    });

    //alert("http://"+charmeUser.server+"/charme/auto.php");

    $('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
      prePopulate: receivers,
      crossDomain: true
    });
  });
}


/***
	Name:
	view_page

	Info:
	Default page class. Build new pages on this model. `postRender` is called after rendering is complete.

	Properties:
	options.template:string:Which template from templates folder do we us?
	options.needLogin:bool:Only for registred users? (Default: true)
	options.useSidebar:bool:Sidebar enabled? (Default: false)
	options.navMatch:string:Which element of main navigation should be highlighted?
	options.forceNewRender: true if view should be rendered new at route change

	Location:
	apl/crypto.js

	Code:JS:

	// Generate a page extending view_page
	var view_test= view_page.extend({

	events:
	{
		'click #mybutton': 'myevent'
	},
	function myevent()
	{
		alert("!!!");
	},
	postRender: function()
	{
		$('#login_user').focus();
	}

	});

	// Open page
	var pa = new view_test({template: "welcome",  needLogin: false});

*/

view_page = Backbone.View.extend({



  subPage: null,
  el: '#page',


  options: {
    template: 'none',
    useSidebar: false,
    navMatch: '',
    needLogin: true
  },

  events: {

    //	"click  a" : "testClick"
  },



  initialize: function() {



  },


  // Warning: do not add initlize function, because passing arguments does not work then!

  getData: function() {

  },
  setSub: function(s) {

    // Close old subView first
    if (this.sub != null) {
      //Problem: #page is removed

      this.sub.undelegateEvents();

      // Hide notification menu when opening new page
      if (container_main)
        container_main.hideNotificationsMenu();
    }
    this.sub = s;

  },


  finishRender: function(d, d2) {
    if (container_main.currentViewId != "find")
      $("#searchField").val(""); // Reset search box

    if (this.options.navMatch != '') {

      $(".sbAlpha ul li, .header.responsive .row1 a").removeClass("active");
      $(".sbAlpha ul li a[data-topic='" + this.options.navMatch + "']").parent().addClass("active");
      $(".header .row1 a[data-topic='" + this.options.navMatch + "']").addClass("active");
    }
    if (this.options.useSidebar || this.options.useResponsiveSidebar)
      $('.subCont').html($('div[title=submenu_items]').html());

    if (this.options.useSidebar) {

      $('.sbBeta').removeClass("responsive");
      $('.page_content').css("width", "700px");
      $('.page_content').css("margin-left", "150px");

      if (!isResponsive())
        $('.sbBeta').show();

      $('#barmenu').show();
      $(".subCont").append('<div id="colorbg"></div>');

    } else {
      $('.page_content').css("width", "850px");
      $('.page_content').css("margin-left", "0");
      $('.sbBeta').hide();
      $('#barmenu').hide();
      $('.sbBeta').addClass("responsive");

      if (this.options.useResponsiveSidebar) {
        $('#barmenu').show();
        $('.sbBeta').addClass("responsive");
      }
    }

    if (charmeUser == undefined)
      $(".loggedOutOnly").show();

    if (this.postRender != null) {
      this.postRender();

    }
  },

  render: function() {

    if (this.options.expViewId == undefined)
      this.options.expViewId = this.options.template;

    if (this.options.noLogin != true && !isLoggedIn()) {

      logout();
      return;
    }

    // Page has changed not changed. Only subpage. -> Just render subpage
    if (container_main.currentViewId == this.options.expViewId && !this.options.forceNewRender) {
      // Just update SubView, we are allowed to render it here as parent view is already rendered
      this.sub.render();

    } else {

      if (this.options.optionbar != null) {

        $(".sbBeta .actionBar").html(this.options.optionbar + "<br style='clear:both'>");
      } else
        $(".sbBeta .actionBar").html("");

      container_main.currentViewId = this.options.expViewId;
      var that = this;

      $.get("templates/" + this.options.template + ".html", function(d) {

        _.templateSettings.variable = "rc";
        var templateData = that.getData();
        var template = _.template(d, templateData);

        $(that.$el).html(template);

        that.finishRender(d);
        that.delegateEvents();

        // Render SubView if exists
        if (that.sub != undefined)
          that.sub.render();
      });
    }
  },
});


view_subpage = Backbone.View.extend({
  el: '#page',
  options: {},

  initialize: function() {

  },

  render: function() {
    var that = this;


    // Cancel message update timer
    $.doTimeout('messageupdate', false);

    $.get("templates/" + this.options.template + ".html", function(d) {

      var templateData = {};

      if (typeof that.getData !== "undefined") {

          _.templateSettings.variable = "rc";
        templateData = that.getData();

      }
      console.log();
      var template = _.template(d, templateData);

      // Problem: Selector may be okay, but element may have changed -> choose $el.selector in stead of el??
      $(that.$el.selector).html(template); //that.$el.selector

      // mouse down effect for 32x32 imge buttons
      $(".actionIcon").mousedown(function() {
        var x = $(this).data("bgpos");

        if (!$(this).hasClass("active"))
          $(this).css("background-position", x + "px -48px");
      }).mouseup(function() {

        if (!$(this).hasClass("active"))
          $(this).css("background-position", $(this).data("bgpos") + "px -0px");

      }).mouseleave(function() {

        if (!$(this).hasClass("active"))
          $(this).css("background-position", $(this).data("bgpos") + "px -0px");

      });

      that.delegateEvents();

      $(".sbBeta ul li, .profileTabs ul li, .navMatch ul li").removeClass("active");
      $(that.options.navMatch).addClass("active");


      if (that.postRender != null) {
        that.postRender();



        updateTitle();


      }

      if (isResponsive()) // Hide sidebar ("Hamburger Menu" in repsonsive mode) in repsonsive mode after click
        $('.sbBeta').hide();


    });
    // Set sb beta
    //alert(that.options.navMatch);



    // call prototype.finishredner();


    // if this.getData != null render...
  }
});

function updateTitle() {

  var title = $(".meta[title='title']").text(); // Page Title
  if (title == "")
    title = "&nbsp;";

  $("#responsiveTitle").html(title);

}

function setSCHeight() {

  $(".msgScrollContainer").css("height", ($(window).height() - 82) + "px");
  $('.nano').nanoScroller();

}

$(window).resize(function() {

  setSCHeight();
  if (  typeof container_main.currentView !== "undefined" &&  container_main.currentView != null) {
    if (!isResponsive()
    && container_main.currentView.options.useSidebar ) // Show or hid eSidebar on resize
        $('.sbBeta').show();
    else {
        $('.sbBeta').hide();
    }
}

});

var view_notifications = view_page.extend({
  options: {
    template: 'notifications_full'
  }

  ,
  postRender: function() {
    updateTitle();

    $.get("templates/notifications.html", function(d) {
      apl_request({
        "requests": [{
            "id": "notifications_get"
          }

        ]
      }, function(d2) {

        var templateData = d2;
        _.templateSettings.variable = "rc";
        var template = _.template(d, templateData);
        $("#button_notifications").text("0");
        $('a[data-topic="notifications"]').text("0");
        $('.notificationContainer').html(template);

        that.posNotificationMenu(); {
          obj.addClass("active");
          $('.actionCont').show().css("top", 31);;
        }
      });

    });




  },
  getData: function() { }
});

var view_find = view_page.extend({
  options: {
    template: 'find'
  },

  events: {
    "click  #but_startsearch": "startsearch",
       'keydown #responsiveSearchInput': 'keyDownInput'
  },

  startsearch: function() {
    app_router.navigate("/find/"+$("#responsiveSearchInput").val(), {trigger: true, replace: false});

  },

  keyDownInput: function(e) {
    var code = e.keyCode || e.which;
       if(code == 13) {
        this.startsearch();
       }
  },

  postRender: function() {
    //
    $("#fld_q").text(this.options.q);
    if (this.options.q != "undefined")
        $("#responsiveSearchInput").val(this.options.q).focus().select();
    updateTitle();
  },

  getData: function()
  {
    console.log(this.options.data);
    return this.options.data;
  }
});

/*
	The registration view where new users can register
*/

var view_register = view_page.extend({

	options: {
    template: 'signup'
  },

	events: {
    "click  #but_makecert": "makecert",
    "click  #but_signupok": "signup",
    "click  #but_hostok": "proceedToPage2"
  },

	initialize: function() {

  },

  proceedToPage2:function() {


    var server = $("#input_hostserver").val();


    apl_request({
      "requests":   [
        {
          "id": "ping"
        } ]
    },
    function(d) {
      if (d.ping.signupblocked)
      {
        alert("This Server does not accept user registrations.");
      }
      else if (d.ping.pong) {
      $("#form_signup").show();
      $("#prompt_server").hide();
          $("#inp_server").val(server);
          $("#inp_agb").attr("href", "http://"+server+"/charme/config/terms.html");
      }
    }, "", server);


  },

  showError: function(code) {
    $("#box_errors div").hide();
    $("#box_errors").hide();
    $("#box_errors").show();
    $("#error" + code).show();
  },

  postRender: function() {

    $("#box_errors div").hide();
    $("#box_errors").hide();
  },

  signup: function() {

    var that = this;
    var serverurl = $('#inp_server').val();
    var userid = $("#inp_username").val() + "@" + serverurl;
    var pass = $('#inp_pass').val();
    var username = $('input[name=firstname]').val() + " " + $('input[name=lastname]').val();



    /*
		TODO: check errors!
			if ($data["password"] != $data["password2"])
			$arr["error"] = 12;
		else if (strlen($data["password"]) < 4 || strlen($data["password"]) >30)
			$arr["error"] = 4;
		else
		*/

    if ($('#inp_pass2').val() != $('#inp_pass').val()) {
      this.showError(12);
      return;

    } else if ($('#inp_pass').val().length < 4 || $('#inp_pass').val().length > 32) {
      this.showError(4);
      return;
    }

    $('#inp_pass2').val("");
    $('#inp_pass').val(""); // DO NOT SERIALIZE PASSWORDS!!

    apl_request({
      "requests": [{
          "id": "reg_salt_set",
          "userid": userid
        }

      ]
    }, function(d2) {
      if (d2.reg_salt_set.error == "user_already_exists")
      {
        alert("User id already exists.");
        return;
      }

			var hashpass = CryptoJS.SHA256(pass + d2.reg_salt_set.salt).toString(CryptoJS.enc.Base64); // Generate a hashed password
      var disabled = $("#form_signup").find(':input:disabled').removeAttr('disabled'); // Remove disabled property temporary as serializeArray does not take disabled inputs into account
      var formData = $("#form_signup").serializeObject();  // Convert signup form data to JSON object

      var dataToBeSigned = {username: username};
      var fastkey1 = that.fastkey1;


      var signedData = crypto_hmac_make(dataToBeSigned, fastkey1, 1);

      formData.signedData = signedData; // Append to formData
		  formData.hashpass = hashpass; // Add hashed password to form data

      var publicKey = $.parseJSON($("#pubkey").val());
      var  requests =
      [
        // user_register must be the first request to set session Id on the server!!!!
        {
          "id": "user_register",
          "data": formData,
        },

        // The second request adds our own public key to the key directory
        CharmeModels.Keys.makeKeyStoreRequestObject(
            publicKey.publickey,  // The public key consiting of n and e
            1,                    // Revision of public key
            userid,               // User id of currently logged in user
            username              // The username
        )
      ];

      apl_request({
        "requests": requests
      },
			function(d) {
        var data = d.user_register;
        console.log(data);
        if (data.error != null) {
          that.showError(data.error);
          disabled.attr('disabled','disabled'); // Enable previously disabled fields again
          $(window).scrollTop(999999);
        }
        else if (data.success == 1) {
              localStorage.setItem("userAutoComplete",userid);
              localStorage.removeItem("passPassphrase");

          disabled.attr('disabled','disabled');  // Enable previously disabled fields again
          location.replace('#signup_success');
        }
      }, "", serverurl);
    }, "", serverurl);
  },

  makecert: function() {

    // certificates are generated in a bakcground task
    var worker = new Worker("lib/crypto/thread_makeSignature.js");
    $("#but_makecert").text("Please Wait...");
    var that = this;

    worker.onmessage = function(e) {

      console.log(e.data);

      var fastkey1 = randomAesKey(32);
      that.fastkey1 = fastkey1; // Needed later for signing the username

      var fastkey2 = randomAesKey(32);
      var randomsalt1 = randomSalt(32);
      var randomsalt2 = randomSalt(32);

      //n, e, d, p, q, dmp1, dmq1, coeff
      var certificate = [{
        revision: 1,
        fastkey1: fastkey1,
        fastkey2: fastkey2,

        randomsalt1: randomsalt1,
        randomsalt2: randomsalt2,

        rsa: {
          rsa: {
            n: e.data.n.toString(),
            e: e.data.e.toString(),
            d: e.data.d.toString(),
            p: e.data.p.toString(),
            q: e.data.q.toString(),
            dmp1: e.data.dmp1.toString(),
            dmq1: e.data.dmq1.toString(),
            coeff: e.data.coeff.toString(),
          }
        }
      }];


      // Save to a temporary keyring object because we need the fastkey for our own key directory!
      // Make sure we can not override an alreay exsiting keyring
      if (typeof charmeUser !== "undefined") {
        // Logout here!
        silentLogout();

      }

        charmeUser = {
          keyring: [
            {
            revision: 1,
            fastkey1: fastkey1
            }
          ]
        };

      $('#template_certok').show();
      $('#template_certhint').hide();

      var passphrase = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 20; i++)
        passphrase += possible.charAt(Math.floor(Math.random() * possible.length));

      // Encrypt certificate with passpharse
      var tt = aes_encrypt(passphrase, JSON.stringify(certificate));
      var pub = {
        revision: 1,
        publickey: {
          n: e.data.n,
          e: e.data.e
        }
      };

      $("#pubkey").val(JSON.stringify(pub));
      var newpublickeyPEM = CharmeModels.Signature.keyToPem(e.data.n, e.data.e);

      $("#pemkey").val(newpublickeyPEM);
      $("#template_certkey").text(passphrase);
      $("#rsa").val(tt);
    };
    worker.postMessage("");
  }
});

function global_addLocation(element, callback, keepMap) {

  ui_mapSelector(element, function (lon, lat) {
    var name = prompt("Enter a Name");
    if (name == null) return;

    data = {
      "position": {
        "type" : "Point",
        "coordinates" : [parseFloat(lon), parseFloat(lat)]
      },
      "name": name
    };

    apl_request({
      "requests": [{
        "id": "simpleStore",
        "action": "add",
        "class": "location",
        "data": data,
        "return" : "complete" // Return complete object to get mongoDB modified
        // float values. Otherwise signatures will not work
      }, ]
    }, function(d) {
      $(".locationContainer").append("<option value='" + xssText(d.simpleStore.itemId.$id) + "'>" + xssText(data.name) + "</option>");
      $(".locationContainer option:last-child").data("json", d.simpleStore.data);
      //CharmeModels.Context.setupLocationSelector();
      console.log(d.simpleStore.data);

      $(element).prev().data("storage", d.simpleStore.data);
      $(element).prev().children("option:last").attr("selected","selected");

      $(".locations").append("<li>" + xssText(data.name) + " <a data-locationid='" + xssText(d.simpleStore.itemId.$id) + "'>Delete</a></li>");
      $(".nolocations").hide();
      if (callback !== undefined)
        callback();

    });
  }, keepMap);




}


// Post field, user can post from here
control_postField = Backbone.View.extend({
  events: {
    'click #mypostbutton': 'doPost',
    'click #btn_addContext': 'addContext',
    'change #collectionSelector': 'changeCollection'

  },

  addContext: function() {

      var that = this;

      apl_request({
        "requests": [
          {
            "id": "simpleStore",
            "action": "get",
            "class": "location"

          },
          {
            "id" : "lists_get"
          }
        ]
      }, function(d22) {


        $.get("templates/box_context.html", function(d) {
          _.templateSettings.variable = "rc";
          var template = _.template(d, {userlists: d22.lists_get});

        ui_showBox(template, function() {

          $("#but_goback").click(function() {

            $("#contextContainer .scroller").animate({
              left: -0
            }, 400);


          });


          $(".contextItem").click(function() {

          var contextType = $(this).data("type");
          var html = CharmeModels.Context.getForm(contextType);

          $("#contextDetails").html(html);

          $("#advancedproperties").click(function() {
            $(".optionalproperty").show();
              $("#advancedproperties").parent().remove();
          });

          $("#contextContainer .scroller").animate({
            left: -400
          }, 400);
          $("#but_addContext").fadeIn(400);

            $.each(d22.simpleStore, function(d) {
              $(".locationContainer").append("<option value='" + this._id.$id + "'>" + this.data.name + "</option>");
              $(".locationContainer option:last-child").data("json", this.data);


            });
            $(".locationContainer option.nolocation").data("json", {
              disabled: true
            });

            CharmeModels.Context.setupLocationSelector();
            CharmeModels.Context.initProductSelector();

            $("#but_addContext").click(function() {

              //
              // PART: Convert String to numbers
              // In this part we convert JSON strings that are numbers (like free seats, money values)
              // to numbers, so that they appear without quotes in mongoDB and can be filter_expanded
              // out by constraints
              //
              var intFields =   CharmeModels.Context.getContextIntegers(contextType);
              var floatFields =   CharmeModels.Context.getContextFloats(contextType);
              that.metaData = {}
              var metaDataTemp = $('#contextDetails').serializeObject();

              var missingFields = false;
              $('#contextContainer').find('input, select').each(function(){
                  if($(this).prop('required') && $(this).val() == ""){
                      missingFields=true;

                      if ($(this).data("requiredref") !== undefined)
                        $($(this).data("requiredref")).addClass("requiredBg");
                      else
                        $(this).addClass("requiredBg");

                  }
                  else {
                    $(this).removeClass("requiredBg");
                  }
              });
              if (missingFields){
                $("#errorRequiredContextField").show();
              //  alert("Please fill out all required fields.");
                return;
              }



              $.each(metaDataTemp, function(index, value) {
                if ($.inArray(index, floatFields) !== -1) {
                  value = parseFloat(value);
                }
                if ($.inArray(index, intFields) !== -1) {
                  value = parseInt(value);
                }
                that.metaData[index] = value;

              });


              // The context type (offer, move, etc...)
              that.metaData.type = contextType;


              var audienceListId = $('#audienceSelector').val();

              if (audienceListId != 0) {
                that.metaData.audienceListId = [audienceListId]; // List of people....

              }
              else { // Prevent old context audience beeing reuused again
                that.metaData.audienceListId = undefined;
              }


              $("#metaIndicator").show(); // Show a field displaying note like context items are unecnrypted etc.
              $("#btn_addContext, #postOptions").hide();

              ui_closeBox();

            });

            $(".but_addLocation").click(function() {
              global_addLocation(this);
            });
          });
        });
      });
    });
  },
  doRealPost: function(postText, edgekeys) {

    var myPostKey = "";
    var isEncrypted = 0;
    var fkEncPostKey = "";
    var postKey;
    var keys = [];
    var that = this;
    var collectionId;
    var imgFileContent = $('#inp_postImg').data("filecontent");
    var repostdata;

    if (edgekeys != "-") {

      postKey = randomAesKey(32);
      postText = aes_encrypt(postKey, postText);
      isEncrypted = 1;

      jQuery.each(edgekeys, function() {

        var fastkey = getFastKey(0, 1);
        var edgekey = crypto_decryptFK1(this.key.obj.edgekeyWithFK).message;

        var postKeyEnc = aes_encrypt(edgekey, postKey); // TODO: add integrity protection for fastkey revision

        fkEncPostKey = crypto_encryptFK1(postKey);

        keys.push({
          userId: this.key.obj.publicKeyUserId,
          key: postKeyEnc,
          revisionB: this.key.obj.publicKeyRevision,
          edgeKeyRevision: this.key.obj.revisionSum
        });

        if (this.key.obj.publicKeyUserId == charmeUser.userId)
          myPostKey = postKey;

        //this.fkEncEdgekey
      });
      // Encrypt edgekeys here.

    }

    if (this.options.collectionId == "") {  // If collection Seletor enabled, get value from collection selector
      collectionId = $("#collectionSelector option:selected:first").data("collectionid");

    }
    else
      collectionId = this.options.collectionId;

    if ($('#repostContainer').is(':visible'))
      repostdata = $('#repostContainer').data("postdata");

    console.log(that.metaData);console.log(that.metaData);console.log(that.metaData);
    completePost = function(images) {
      var signature = new CharmeModels.Signature(postText + imgFileContent);

      // Public post object, should not contain any keys. All Data that will be signed with the private key
      var postObj = {
        content: postText,

        isEncrypted: isEncrypted,
        keyRevision: getFastKey(0, 1).revision, // Current Fastkey, needed to get decryption key version.
        repost: repostdata,
        author: charmeUser.userId,
        metaData: that.metaData
      };


      if (typeof that.metaData === 'undefined')
        postObj.collectionId = collectionId;


      var postData = CharmeModels.Signature.makeSignedJSON(postObj);

      if (typeof images === "undefined") {
        images = [];
        images[200] = "";
        images[900] = "";

      }

      apl_request({
        "requests": [{
          "id": "collection_post",
          "postData": postData,
          "imgdata": images[900],
          "imgthumbdata": images[200],
          "fkEncPostKey": fkEncPostKey,
          "keys": keys
        }, {
          "id": "profile_get_name",
          userId: charmeUser.userId
        }]
      }, function(d) {


        var name = d.profile_get_name.info.firstname + " " + d.profile_get_name.info.lastname;
        var elid, layout;

        if (that.options.collectionId != "") {
          elid = ".collectionPostbox";
        } else {
          layout = "stream";
          elid = "#streamContainer";
        }

        // Remove image
        $("#but_remImg").trigger('click');

        that.metaData = undefined;
        $("#metaIndicator").hide();
        $("#btn_addContext, #postOptions").show();

        $("#textfield").val("");

        var postItem3 = {
          post: postObj,
          postId:
            d.collection_post.id
        ,
          meta: {
            username: name,
            time: {
              sec: new Date().getTime() / 1000
            },
            hasImage: d.collection_post.hasImage
          },
        };


        var p2 = new control_postItem({
          postObj: postItem3,
          postKeyTemp: myPostKey,
          liveAdd: true,
          layout: layout,
          el: $(elid),
          prepend: true,
        });
        p2.render();
      });
    }

    if (imgFileContent != undefined) {
      if (isEncrypted == 1) {

        var srcimg = new Image();
        srcimg.src = imgFileContent.result;
        srcimg.onload = function() {
          imagesTemp = imageManipulate_multiscale(srcimg, [200, 900]);

          images = []
          // Encrypt Images:
          jQuery.each(imagesTemp, function(index, item) {

            images[index] = aes_encrypt(postKey, item);
          });
          completePost(images);
        }
      } else {
        var srcimg = new Image();
        srcimg.src = imgFileContent.result;
        srcimg.onload = function() {
          images = imageManipulate_multiscale(srcimg, [200, 900]);
          // Encrypt Images:
          if (typeof postKey !== "undefined")
          imgFileContent = aes_encrypt(postKey, imgFileContent.result);
          else {
            imgFileContent = imgFileContent.result;
          }
          console.log(images);
          completePost(images);
        }
      }
    } else
      completePost();



  },
  doPost: function() {

    var txt = $("#textfield").val();
    var that = this;

    var isContextPost = $("#metaIndicator").is(":visible"); // Is it a context post?

    // Check if we need to encrypt the collection. We also do not encrypt if it is a context post
    if (!isContextPost && that.options.forceCurrentList != 0 && that.options.forceCurrentList != undefined) {

      apl_request({
        "requests": [{
          "id": "edgekeys_bylist",
          "addSessionUser": true,
          "listId": that.options.forceCurrentList,
        }]
      }, function(d) {

        that.doRealPost(txt, d.edgekeys_bylist.value);
      });
    } else if (!isContextPost &&  $("#collectionSelector option:selected:first").data("isencrypted") == true) {
      apl_request({
        "requests": [{
          "id": "edgekeys_bylist",
          "addSessionUser": true,
          "listId": $("#collectionSelector").val(),
        }]
      }, function(d) {



        if (d.edgekeys_bylist.value.length < 1) {
          alert("Error: No Public Keys found....");
          return;
        }


        that.doRealPost(txt, d.edgekeys_bylist.value);
      });
    } else
      this.doRealPost(txt, "-");

  },

  render: function() {


    var that = this;

    var addbox = function(that, items) {

      that.$el.append("<textarea class='box' id='textfield' style=' width:100%;'></textarea><div  style='margin-top:8px; display:none;' id='imgPreview'></div><div style='margin-top:8px;'><a type='button' id='mypostbutton' class='button but_postCol' style='margin-right:8px;' value='Post'>Post</a><span id='postOptions'></span><span id='postOptions2'></span></div>");

        $('#postOptions2').append("<div style='height:16px' class='onlyResponsive'></div>");
      $('#postOptions2').append("<input id='inp_postImg' type='file' style='display:none'><a class='cui_imgbutton' id='but_addImg'><i class='fa fa-image'></i> <span class='onlyResponsive'>Add Image</span></a>");

      if (that.options.collectionId == "")
      $('#postOptions2').append("<span id='spanContext'><a title='Add Meta' class='cui_imgbutton' id='btn_addContext'><i class='fa fa-eye'></i> Add Context</a></span>");


      $('#postOptions2').append("<a style='display:none' id='but_remImg'>Remove Image</a> <span style='display:none' id='metaIndicator'><a  class='cui_imgbutton' id='but_remMeta'><i class='fa fa-times'></i>  Remove Context</a><div style='height:16px' class='onlyResponsive'></div><i class='fa fa-warning'></i> Posts are neither encrypted nor part of a collection when containing Context.</span>");

      $("#but_remMeta").click(function() {
        that.metaData = undefined;
        $("#metaIndicator").hide();

        $("#btn_addContext, #postOptions").show();
      });


      $('#inp_postImg').on("change", function(e) {
        that.fileChanged(e);
      });

      $('#but_addImg').click(function() {

        $("#inp_postImg").trigger('click');
      });

      $('#but_remImg').click(function() {

        $('#inp_postImg').data("filecontent", null);
        $("#but_remImg").hide();
        $("#but_addImg").show();

      });

      if (items != "")
        $('#postOptions').append("in<select  id='collectionSelector'>" + items + "</select>");

      if (that.options.forceCurrentList != 0 && that.options.forceCurrentList != undefined) {
        $('#postOptions').append("<i class=\"fa fa-lock\"></i> Posts are encrypted in this collection");
      }


    };


    if (this.options.collectionId == "") {


      // Get collections json....
      apl_request({
        "requests": [{
          "id": "collection_getAll",
          "userId": charmeUser.userId
        }, ]
      }, function(d) {

        var items = "";

        jQuery.each(d.collection_getAll, function() {


          var isEncryptedCollection = "false";
          if (this.currentlist != undefined && this.currentlist != 0)
            isEncryptedCollection = "true";

          items += "<option data-collectionid='" + xssAttr(this._id.$id) + "' data-isencrypted='" + xssAttr(isEncryptedCollection) + "' value='" + xssAttr(this.currentlist) + "'>" + xssAttr(this.name) + "</option>";


        });


      {
          addbox(that, items);
        }

        that.changeCollection(); // Make yellow field for encrypted collections

      });


    } else {

      addbox(this, "");
    }


  },
  fileChanged: function(h) {

    var files = h.target.files; // FileList object
    var reader = new FileReader();
    reader.file = files[0];
    reader.onload = function(e) {
      $('#inp_postImg').data("filecontent", this);
    }
    reader.readAsDataURL(reader.file);
    $("#but_remImg").show();
    $("#but_addImg").hide();
    $("#imgPreview").html("preview");


  },
  changeCollection: function() {


    if ($("#collectionSelector option:selected:first").data("isencrypted") == true) {
      $("#collectionSelector").addClass("encrypted");
    } else
      $("#collectionSelector").removeClass("encrypted");



  }

});

control_commentItem = Backbone.View.extend({
  render: function() {

    console.log("comment");

    uniIdCounter++;


    var delitem = "<a data-commentid='" + this.options.commentId + "' id='delete_" + uniIdCounter + "' class='delete'></a>";


    var str = "<div class='comment' id='comment_" + this.options.commentId + "'>" + delitem + "<div class='head'><a href='#/user/" + encodeURIComponent(this.options.userId) + "'>" + this.options.username + "</a></div>" + xssText(this.options.content) + "</div>";
    if (this.options.prepend)
      this.$el.prepend(str);
    else
      this.$el.append(str);

    var that = this;


    // Imporant: Attach event handler AFTER ITEM HAS BEEN ADDED!
    $('#delete_' + uniIdCounter).click(function() {


      var signature = CharmeModels.Signature.makeSignedJSON({
        commentId: that.options.commentId,
        action: "comment_delete"
      });


      apl_request({
        "requests": [{
          "id": "comment_delete",
          "signature": signature
        }, ]
      }, function(d) {

        // Remove post from GUI
        $("#comment_" + that.options.commentId).fadeOut(0);

      });



    });


  }
});

var uniIdCounter = 1; // Belongs to control_postItem below:
var repostTemp = null;


control_postItem = Backbone.View.extend({
  options: {
    prepend: false,
    counter: 0,
    commentCount: 0
  },


  setLikeText: function(itemCounter) {

    $("#counter" + itemCounter).text(this.options.postObj.likecount);
    if (this.options.postObj.like) {
      $("#doLove" + itemCounter).text("Unlove");
    } else {
      $("#doLove" + itemCounter).text("Love");
    }
  },
  addComments: function(items, parentId, prepend) {
    var maxComments = 15;
    var iComments = 0; // !!! Please remove, we will get sued for this name
    var that = this;


    jQuery.each(items, function() {

      iComments++;
      if (iComments > maxComments)
        return;

      if (that.options.postObj.post.isEncrypted == 1) {
        this.commentData.object.text = aes_decrypt(that.options.postKey, this.commentData.object.text);
      }

      var commentid =  "";
      if (this.commentId)
        commentId = this.commentId;
      else {
        commentId = this._id.$id;
      }


      var item = new control_commentItem({
        content: this.commentData.object.text,
        commentId: commentId,
        "username": this.sendername,
        userId: this.commentData.object.userId,
        prepend: prepend,
        el: $('#postComments' + parentId)
      });


      item.render();
    });

  },
  renderFunction: function(that) {

    // Needed for generating unique element identifiers.,
    uniIdCounter++;

    var metaDataStr = "";
    // META DATA START

    //

    //Use uniId inside events like .click() etc., because uniIdCounter is global!!
    var uniId = uniIdCounter;
    var postObj = this.options.postObj;
    var that = this;



    var repoststr = "";
    var liksstr = "<div class='likes'><a class='counter' id='counter" + uniIdCounter + "'>0</a></div>";


    if (this.options.postObj.post.repost != null)
      repoststr = " reposts <a href='#user/" + encodeURIComponent(this.options.postObj.post.repost.userId) + "/post/" + this.options.postObj.post.repost.postId + "'>" + this.options.postObj.post.repost.username + "'s post</a> <div class='repost'>" + $.charmeMl(xssText(this.options.postObj.post.repost.content)) + "</div>";

    var str;
    var imgcont = "";
    var delitem = "<a id='del_post_" + uniIdCounter + "' class='delete'></a>";


    if (this.options.postObj.meta.hasImage) {
      //


      imgcont = "<div style='margin-bottom:8px'><img id='img_" + postObj.postId + "'></div>";

      var url = "http://" + postObj.post.author.split("@")[1] + "/charme/fs.php?type=post&size=250&post=" + postObj.postId;

      console.log(url);
      $.get(url, function(d) {

        if (that.options.postObj.post.isEncrypted == 1) {
          if (that.options.liveAdd) {

            $("#img_" + postObj.postId + "").attr("src", aes_decrypt(that.options.postObj.post.postKey, d));
          } else
            $("#img_" + postObj.postId + "").attr("src", aes_decrypt(that.options.postKey, d));
        } else
          $("#img_" + postObj.postId + "").attr("src", d);



      });
    }



    if (that.options.layout == "stream") {


      var postUser = new apl_user(that.options.postObj.post.author);
      //
      str = "<div class='collectionPost' id='post_" + that.options.postObj.postId+ "'>" +
        "<a href='#user/" + postUser.userIdURL + "'><img class='profilePic' src='" + xssAttr(postUser.getImageURL(64)) + "'></a>" + "<div class='subDiv'>" + liksstr + delitem + "<a href='#user/" + postUser.userIdURL + "'>" + xssText(that.options.postObj.meta.username) + "</a>" + repoststr + "<div class='cont selectable'>" + imgcont + $.charmeMl(xssText(that.options.postObj.post.content)) + "</div><div class='postoptions'><a id='doLove" + uniId + "'>Love</a> - <a id='doArchive" + uniId + "'>Archive</a><!-- - <a id='doRepost" + uniId + "'>Repost</a>--> - <a id='checkSignature_" + uniId + "'>Check Signature</a> -  <span class='time'>" + formatDate(that.options.postObj.meta.time.sec * 1000) + "</span></div>";
    } else
      str = "<div class='collectionPost' id='post_" + that.options.postObj.postId + "'>" + repoststr + "<div class='cont selectable' style='padding-top:0'>" + imgcont + liksstr + delitem + "" + $.charmeMl(xssText(this.options.postObj.post.content)) + "</div><div><a id='doLove" + uniId + "'>Love</a><!--- <a id='doRepost" + uniId + "'>Repost</a>--> - <span class='time'>" + formatDate(that.options.postObj.meta.time) + "</span>";



    str += "<div class='commentBox' id='commentBox" + xssAttr(uniId) + "'><div class='postcomments' id='postComments" + xssAttr(uniId) + "'></div><input id='inputComment" + xssAttr(uniId) + "' class='box' type='text' style='width:100%;  max-width:246px; margin-top:1px;' placeholder='Write a comment'><br></div>"; //<a class='button' id='submitComment"+uniIdCounter+"'>Write Comment</a>
    str += "</div></div>";



    if (that.options.prepend)
      that.$el.prepend(str);
    else
      that.$el.append(str);


    if (this.options.postObj.post.metaData != null && typeof this.options.postObj.post.metaData !== "undefined") {
      var metaData = this.options.postObj.post.metaData;

      try {
      if (metaData["type"] == "move") {
        /*
					onclick='ui_showMap("+parseFloat(metaData.startLocation_data.latitude)+","+parseFloat(metaData.startLocation_data.longitude)+")'>"+xssText(metaData.startLocation_data.name)+ "</a> to <a  onclick='ui_showMap("+parseFloat(metaData.endLocation_data.longitude)+","+parseFloat(metaData.endLocation_data.latitude)+", '"+xssAttr( metaData.startLocation_data.name)+"')'> "+xssText(metaData.endLocation_data.name)+ "</a>

				*/

        var starttime = "";
        if (metaData.startTime_month != "")
          starttime = xssText(metaData.startTime_day) +  "." + xssText(metaData.startTime_month) + "." + xssText(metaData.startTime_year) + " ";
        if (metaData.startTime_hour != "")
          starttime += xssText(metaData.startTime_hour) + ":" + xssText(metaData.startTime_minute);

        var seatsfree = "";
        if (metaData.seats != null && metaData.seats != "")
          seatsfree = " with " + xssText(metaData.seats) + " seats free ";


        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div><a id='loc_" + uniIdCounter + "_start'> " + xssText(metaData.startLocation_data.name) + "</a> <i class='fa fa-long-arrow-right'></i> <a id='loc_" + uniIdCounter + "_end'> " + xssText(metaData.endLocation_data.name) + "</a> " + starttime +  seatsfree +"</div>";

        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);
        $("#loc_" + uniIdCounter + "_start").click(function() {
          ui_showMap(
            parseFloat(metaData.startLocation_data.position.coordinates[1]),
            parseFloat(metaData.startLocation_data.position.coordinates[0]),
            metaData.startLocation_data.name);
        });
        $("#loc_" + uniIdCounter + "_end").click(function() {
          ui_showMap(
            parseFloat(metaData.endLocation_data.position.coordinates[1]),
            parseFloat(metaData.endLocation_data.position.coordinates[0]),
            metaData.endLocation_data.name);
        });


      }



      if (metaData["type"] == "publicevent") {
        /*
					onclick='ui_showMap("+parseFloat(metaData.startLocation_data.latitude)+","+parseFloat(metaData.startLocation_data.longitude)+")'>"+xssText(metaData.startLocation_data.name)+ "</a> to <a  onclick='ui_showMap("+parseFloat(metaData.endLocation_data.longitude)+","+parseFloat(metaData.endLocation_data.latitude)+", '"+xssAttr( metaData.startLocation_data.name)+"')'> "+xssText(metaData.endLocation_data.name)+ "</a>

				*/
        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div><a id='loc_" + uniIdCounter + "_start'> " + xssText(metaData.location_data.name) + "</a> " + xssText(metaData.startTime) + " at " + xssText(metaData.startTime_hour) + " " + xssText(metaData.startTime_minute) + " for " + xssText(metaData.seats) + " guests.</div>";

        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);
        $("#loc_" + uniIdCounter + "_start").click(function() {
          ui_showMap(metaData.location_data.position.coordinates[1], metaData.location_data.position.coordinates[0], metaData.location_data.name);
        });



      }
      if (metaData["type"] == "meal") {
        /*
					onclick='ui_showMap("+parseFloat(metaData.startLocation_data.latitude)+","+parseFloat(metaData.startLocation_data.longitude)+")'>"+xssText(metaData.startLocation_data.name)+ "</a> to <a  onclick='ui_showMap("+parseFloat(metaData.endLocation_data.longitude)+","+parseFloat(metaData.endLocation_data.latitude)+", '"+xssAttr( metaData.startLocation_data.name)+"')'> "+xssText(metaData.endLocation_data.name)+ "</a>

				*/
        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>  for " + xssText(metaData.people) + " guests";

        if (typeof metaData.location_data !== "undefined")
          metaDataStr += "<a id='loc_" + uniIdCounter + "_start'> " + xssText(metaData.location_data.name) + "</a>";

        metaDataStr += "</div>"

        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);
        $("#loc_" + uniIdCounter + "_start").click(function() {
          ui_showMap(metaData.location_data.position.coordinates[1], metaData.location_data.position.coordinates[0], metaData.location_data.name);
        });



      }




      if (metaData.type == "activity") {

        var location = "";



        if (typeof metaData.location_data !== "undefined")
        {
        location =   " in <a id='loc_" + uniIdCounter + "'> " + xssText(metaData.location_data.name) + "</a> ";



        }
        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>" + xssText(metaData.activity) + location + "</div>";

        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);

        $("#loc_" + uniIdCounter + "").click(function() {
            ui_showMap(
              parseFloat(metaData.location_data.position.coordinates[1]),
              parseFloat(metaData.location_data.position.coordinates[0]),
              metaData.location_data.name);
          });


      }
      if (metaData.type == "lend") {

        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>" + xssText(metaData.currency + " " + metaData.price) + " per day</div>";
        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);


      }

      if (metaData.type == "offer") {

        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>"+ CharmeModels.Context.catById(charme_schema_categories, metaData.sell) +" - " + xssText(metaData.currency + " " + metaData.price) + "</div>";
        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);


      }
      if (metaData.type == "review") {

        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>" + xssText(metaData.rating) + "</div>";
        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);


      }

      if (metaData.type == "service") {


        metaDataStr = "<div class='metaData meta_" + metaData.type + "'><div class='point'></div>" + charme_schema_services_names[metaData.service] + " for " + xssText(metaData.currency + " " + metaData.price) + " per hour</div>";
        $("#post_" + that.options.postObj.postId + " .cont").append(metaDataStr);


      }


      }
        catch(e) { console.log("Exception at post meta data");}


    }




    $("#checkSignature_" + uniIdCounter).click(function() {
      CharmeModels.Signature.showDialog();
    });
    // REgister event handler AFTER HTML has been added
    $("#del_post_" + uniIdCounter).click(function() {

      // TODO: ARE YOU SURE?

      var signature = CharmeModels.Signature.makeSignedJSON({
        postId: that.options.postObj.postId,
        action: "delete_post"
      });


      // Send request for post deletion to server
      apl_request({
        "requests": [{
          "id": "post_delete",
          "postId": that.options.postObj.postId,
          "signature": signature
        }, ]
      }, function(d) {
        // Remove post from GUI
        $("#post_" + that.options.postObj.postId).fadeOut(0);

      });

    });

    that.setLikeText(uniIdCounter);


    $("#doArchive" + uniId).text((that.options.postObj.archived ? "Unarchive" : "Archive"));




    $("#doArchive" + uniId).click(function() {
      NProgress.start();

      apl_request({
        "requests": [
          // Get posts of collection
          {
            "id": "post_archive",
            "userId": that.options.postObj.post.author,
            status: !that.options.postObj.archived ? true : false,
            postId: that.options.postObj.postId
          },
          // Get name of collection

        ]
      }, function(d) {
        NProgress.done();

        that.options.postObj.archived = !that.options.postObj.archived;
        $("#doArchive" + uniId).text((that.options.postObj.archived ? "Unarchive" : "Archive"));
      });




    });

    $("#doLove" + uniId).data("uniid", uniId);

    $("#doLove" + uniId).click(function() {


      var that2 = this;
      NProgress.start();
      // Send like request to post owner:
      apl_request({
        "requests": [
          // Get posts of collection
          {
            "id": "post_like",
            "userId": that.options.postObj.post.author,
            status: !! !that.options.postObj.like,
            postId: that.options.postObj.postId
          },
          // Get name of collection

        ]
      }, function(d) {

        NProgress.done();

        if (that.options.postObj.like) {
          that.options.postObj.likecount--;
          that.options.postObj.like = false;
        } else {
          that.options.postObj.likecount++;
          that.options.postObj.like = true;
        }

        that.setLikeText($(that2).data("uniid"));

      });

    });



    // append some comments
    var itemStartTime;
    if (that.options.postObj.comments != undefined && that.options.postObj.comments.length > 0) {


      that.addComments(that.options.postObj.comments, uniId, false);
      itemStartTime = that.options.postObj.comments[0].itemTime.sec;

    }



    if (that.options.postObj.commentCount > 3)
      $('#commentBox' + uniId).prepend("<a class='morecomments'>More</a>"); //data-start=TotalComments-6





    $('#commentBox' + uniId + " .morecomments").click(function() {



      if (that.options.start == undefined) {
        that.options.start = that.options.postObj.commentCount - 6;
        if (that.options.start < 0)
          that.options.start = 0;
      }


      var limit = 3;

      if (that.options.start == 0) {

        limit = that.options.postObj.commentCount % limit;

      }


      NProgress.start();

      apl_request({
        "requests": [{
          "id": "comments_get",
          "postowner": that.options.postObj.post.author,
          "itemStartTime": itemStartTime,
          "start": that.options.start,
          "limit": limit,
          "postId": that.options.postObj.postId
        }, ]
      }, function(d) {
        NProgress.done();
        if (that.options.start == 0)
          $('#commentBox' + uniId + " .morecomments").remove();


        if (that.options.start == -1) // Save given start id
          that.options.start = d.comments_get.start;
        else
          that.options.start -= 3; // Succes -> Load further comments from here

          that.addComments(d.comments_get.comments, uniId, true);



        if (that.options.start < 0) {
          that.options.start = 0;

        }

      }, "", that.options.postObj.post.author.split("@")[1]);

    });



    $("#inputComment" + uniId).unbind("keypress").keypress(function(e) {

      // Send comment when pressing return key
      if (e.which == 13) {

        var content = $("#inputComment" + xssAttr(uniId)).val();
        var contentRaw = content; // Used for displaying text.
        var that2 = that;

        if (that.options.postObj.post.isEncrypted == 1) {

          if (that.options.postObj.post.postKey != undefined) {
            // Post Control item was added after post click (e.g user posts something new). The key was transmitted over options.postKeyTemp
            content = aes_encrypt(that.options.postObj.post.postKey, content);
          } else if (that.options.postKey != undefined) {
            // Post Control was added after stream was loaded
            content = aes_encrypt(that.options.postKey, content);
          } else {
            return;
          }

        }
        // Make signed comment object.
        var commentData = CharmeModels.Signature.makeSignedJSON({
          "text": content,
          "postId": that.options.postObj.postId,
          "userId":charmeUser.userId,
          "postOwner":  that.options.postObj.post.author

        });


        apl_request({
          "requests": [{
            "id": "post_comment",
            "commentData": commentData,

          }, ]
        }, function(d) {
          var item2 = new control_commentItem({
            "content": contentRaw,
            "username": d.post_comment.username,
            userId: charmeUser.userId,
            el: $('#postComments' + uniId),
            commentId: d.post_comment.commentId
          });
          item2.render();
          $("#inputComment" + xssAttr(uniId)).val("");

        });

      }
    });



    $("#doRepost" + uniId).click(function() {

      repostTemp = {
        userId: that.options.postObj.post.author,
        postId: that.options.postObj.postId,
        content: that.options.postObj.content,
        username: that.options.postObj.username
      };
      app_router.navigate("stream", {
        trigger: true
      });


      appendRepost();


    });



    $("#counter" + uniId).click(function() {



      // ! Request to profile owners server
      apl_request({
          "requests": [
            // Get posts of collection
            {
              "id": "post_getLikes",
              postId: that.options.postObj.postId
            },
            // Get name of collection

          ]
        }, function(d2) {


          $.get("templates/box_likes.html", function(d) {
            _.templateSettings.variable = "rc";
            var template = _.template(d, d2);

            ui_showBox(template, function() {

            });

          });

        }

        , "", that.options.postObj.post.author.split("@")[1]);


    });

    // If we are on the stream page, then bind loading indicator if all posts have been appended
    if (typeof that.options.isLastElement != "undefined" && that.options.isLastElement == true && typeof container_main.currentView.sub.bindAutoLoader !== "undefined") {
      container_main.currentView.sub.bindAutoLoader();
      $("#streamLoadingIndicator").fadeOut(500);
    }

  }, // Render Function end


  render: function() {

    var postObj = this.options.postObj;
    var that = this;


    if (that.options.isCollectionView || that.options.liveAdd) {
      if (that.options.postKey != "") {
        if (this.options.postObj.post.isEncrypted) {
          that.options.postObj.post.content = aes_decrypt(that.options.postKeyTemp, that.options.postObj.post.content);
          that.options.postObj.post.postKey = that.options.postKeyTemp;
        }
      }

      that.renderFunction(that);
    } else if (this.options.postObj.post.isEncrypted == 1 && !this.options.liveAdd) {


      var afterEdgeKey = function(edgeKey) {


        var postKey = aes_decrypt(edgeKey, postObj.postKey);
        var text = aes_decrypt(postKey, postObj.post.content)
        that.options.postKey = postKey;
        that.options.postObj.post.content = text;
        that.renderFunction(that);
      }
      // If we do not have the edgekey yet, then get it and decrypt it!
      var cacheKey = "EKEY-" + that.options.postObj.post.author + "-" + this.options.postObj.edgeKeyRevision;
      var postKeyCached = checkCache(cacheKey);

      if (postKeyCached != null) {
        console.log("CACHED PKEY" + postKeyCached);
        afterEdgeKey(postKeyCached);
      } else {
        apl_request({
          "requests": [{
            "id": "edgekey_request",
            "publicKeyOwner": that.options.postObj.post.author,
            "revision": this.options.postObj.edgeKeyRevision,
            "privateKeyOwner": charmeUser.userId, // This is me
          }, ]
        }, function(data) {
          console.log(data);
          try {
          var edgeKey = (crypto_rsaDecryptWithRevision(data.edgekey_request.data.key.obj.edgekeyWithPublicKey, data.edgekey_request.data.key.obj.publicKeyRevision));
          afterEdgeKey(edgeKey);
          storeCache(cacheKey, edgeKey);
        }
        catch(err) { console.warn("Error getting edgekey for "+that.options.postObj.post.author+": "+err.message);}
        }, "", that.options.postObj.post.author.split("@")[1]);

      }
    } else if (this.options.liveAdd && this.options.postObj.post.isEncrypted == 1) {


      that.options.postObj.post.content = aes_decrypt(that.options.postObj.post.postKey, that.options.postObj.post.content);
      that.renderFunction(that);
    } else
      that.renderFunction(that);



  }

});


control_collectionItem = Backbone.View.extend({

  render: function() {

    this.$el.append("<a class='collection' href='#user/" + encodeURIComponent(container_main.currentView.options.userId) + "/collections/" + xssAttr(this.options.data._id.$id) + "'>" + xssText(this.options.data.name) + "</a>");
  }

});


/*
	GUI Helper for reposts, can be called from #stream or #profile
	Reposts the post, specified in reposTemp.
*/

function appendRepost() {
  /*
<div id='repostContainer' style='background-color: #efefef; display:none;'>
<a id='cancelRepost'>Cancel Repost</a>
<div id='repostUsername' style='padding-bottom:8px'></div>
<div id='repostContent'></div>
	*/
  if (repostTemp != null && $("#repostContainer").length > 0) {

    // repostTemp.username
    $('#repostContainer').show();

    // This data will be sent to server:
    $('#repostContainer').data("postdata", repostTemp);
    //  Also important: repostTemp.userId, repostTemp.postId
    $('#repostHeader span').text("You repost " + repostTemp.username + "'s post:");
    $('#repostContent').html($.charmeMl(xssText(repostTemp.content)));
    $('#textfield').focus();
    repostTemp = null;
  }
}



var view_stream_display = view_subpage.extend({
  events: {
    'click #cancelRepost': 'cancelRepost'

  },
  cancelRepost: function() {
    $('#repostContainer').hide();
  },

  bindAutoLoader: function() {
    var that = this;
    var scrolledDownNotifier = function() {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 1000) {
        that.loadStreamItems(0);


        $(window).unbind('scroll');


      }
    }
    $(window).bind('scroll', scrolledDownNotifier);
  },
  loadStreamItems: function(offset) {
    $("#streamLoadingIndicator").fadeIn(500);
    var that = this;
    if (typeof that.streamOffset === "undefined")
      that.streamOffset = -10;

    that.streamOffset += 10;
    var arguments = {
      "requests": [{
        "id": "stream_get",
        "filter": that.options.filter,
        "streamOffset": that.streamOffset,
      }]
    };

    if (typeof(that.options.filter) !== 'undefined') {
      arguments.filter = that.options.filter;
      arguments.searchSignature =  CharmeModels.Signature.makeSignedJSON({
        time:  new Date().getTime() / 1000,
        filter:  that.options.filter
        // peopleChecksum:
        });

        if (typeof arguments.filter.hint !== "undefined")
          $(".hint").text(arguments.filter.hint).show();
        else {
          $(".hint").hide();
        }

    }

    apl_request(arguments, function(d2) {

      $("#streamLoadingIndicator").fadeOut(500);
      // generate post controls...
      jQuery.each(d2.stream_get, function(index) {

        isLastElement = false;
        if (d2.stream_get.length == (index + 1))
          isLastElement = true;

        if (d2.stream_get.length < 1) {

        }


        var p2 = new control_postItem({
          postObj: this,
          layout: "stream",
          el: $("#streamContainer"),
          prepend: false,
          isLastElement: isLastElement
        });
        p2.render();


      });

      $('#textfield').autosize();

    });

  },
  postRender: function() {

    if (this.options.streamId == "") {
      var t = new control_postField({
        el: $("#postFieldContainer"),
        collectionId: ""
      });
      t.render();
    } else
      $("#postFieldContainer").hide();




    this.loadStreamItems();


    // this.options.streamId is list, 0 is no list.

    // JSON Nrequest to server....

    appendRepost();
  }

});

var view_welcome = view_page.extend({

  events: {
    'keypress #login_password': 'keypass',
    'keypress #login_user': 'keyuser'
  },
  keyuser: function(e) {
    code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13)
      $('#login_password').focus().select();
  },
  keypass: function(e) {


    code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13)
      login();
  },

  postRender: function() {
    $('#login_user').focus();

  }

});


var view_stream = view_page.extend({

  userId: '',


  options: {

    optionbar: '<a style="background-position: -60px 0px;" data-bgpos="-60" id="addFilterButton" class="actionButton"></a>'

  },
  getData: function() {
    _.templateSettings.variable = "rc";
    var templateData = {
      globaldata: [],
    };

    templateData["listitems"] = apl_postloader_getFilters(); //.items.concat(apl_postloader_getListsExtended());
    return templateData;
  },

  events: {

    "click  .shareIt": "shareClick"
  },
  shareClick: function(ev) {
    // Load homepage and append to [sharecontainer]
    console.log("share");
  },
  postRender: function() {


    $(".delList").click(function() {
      console.log($(this));
        var itemId = $(this).attr("data-itemid");

        var that = this;
        NProgress.start();

        apl_request({
          "requests": [{
            "id": "simpleStore",
            "action": "delete",
            "class": "filter",
            "itemId": itemId
          }]
        }, function(d22) {
          $(that).parent().slideUp();
          NProgress.done();

       });

  });

    $('#addFilterButton').click(function() {

      apl_request({
        "requests": [{
          "id": "simpleStore",
          "action": "get",
          "class": "location"

        }, {
          "id": "lists_get"
        }]
      }, function(d22) {

        $.get("templates/box_filter.html", function(d) { // box_filter.html is the template. We will perform most jQuery operations in this function on its html

          contextChoices = CharmeModels.Context.getContextChoices();

          var templateData = {
            userlists: d22.lists_get,
            contextChoices: contextChoices,
            contextConstraints: CharmeModels.Context.getFilters()

          };
          _.templateSettings.variable = "rc";
          var template = _.template(d, templateData);

          ui_showBox(template, function() {

            $(".productCategoryHolder").each(function() {
              var name = $(this).attr("data-name");
              $(this).html(CharmeModels.Context.getProductSelector(name));
            });
            CharmeModels.Context.initProductSelector();

            $("#contextChoices label input").change(function() {

              if ($(this).is(":checked")) {
              $(".constraint").hide();
              $(".constraint_"+$(this).val()).show();
              }
            });

            $(".addContext").click(function() {
              $(".constraint_move").show();
            });

            $(".removeContext").click(function() {
              $(".constraint").hide();
            });


            $("#contextChoices a").click(function() {
              $(this).toggleClass("active");
            });

            $('#filter_lists a').click(function() { // These are the people filter lists

              $(this).toggleClass("active");

              if ($("#cb_onlyMyLists").hasClass("active")) {
                $("#filter_list_detail").show();
              } else {
                $("#filter_list_detail").hide();
              }
            });

            $(".filter_addnew").click(function() {
              $(this).next().slideDown(300);
              $(this).slideUp(300);

            });

            $(".filter_remove").click(function() {
              $(this).parent().slideUp(300);


              $(this).parent().prev().slideDown(300);

            });


            $.each(d22.simpleStore, function(d) {
              $(".locationContainer").append("<option value='" + this._id.$id + "'>" + this.data.name + "</option>"); // TODO: XSS SAVE!!!!!!!!!
              $(".locationContainer option:last-child").data("json", this.data);

            });

            $(".locationRadiusSelect").html(CharmeModels.Context.getRad());
            CharmeModels.Context.setupLocationSelector(); // Must be called after radiues items were added


            $(".but_addLocation").click(function() {
              global_addLocation(this);
            });

            $("input[name=filter_name]").focus().select();
            $("#but_addFilterOk").click(function() {
              if ($("input[name=filter_name]").val() == "")
                alert("Please enter a filter name!");
              else {

                // This is the Object which will be transmitted to the database representing the filter specs
                var filterAsJson = {}
                filterAsJson.name = $("input[name=filter_name]").val();

                if ($("#filter_location").is(":visible")) { // Is the location filter on? If yes add position and radius to JSON
                  filterAsJson.position = $("select[name=filter_location] :selected").data("json");
                  filterAsJson.radius = $("select[name=filter_location_radius] :selected").val()
                }

                if ($("#filter_people").is(":visible")) { // Add the lists with people to the JSON
                  if ($("#cb_onlyMyLists").hasClass("active")) {
                    filterAsJson.lists = []
                    $("#filter_list_detail .hotCheckbox.active").each(function() {
                      filterAsJson.lists.push($(this).data("listid"));
                    });
                  }
                }

                if ($("#filter_context").is(":visible")) { // If a context is specified, add its type to JSON
                  filterAsJson.context = [$('input[name=rb_context]:checked').val()];
                }

                filterAsJson.constraints = [];
                $(".constraintBox:visible input, .constraintBox:visible select").each(function() {

                  if ($(this).attr("data-type") != "additional") {

                    if ($(this).attr("data-type")  == "range") {

                      var elementName = $(this).attr("name");
                      filterAsJson.constraints.push({
                        name: elementName,
                        type: $(this).attr("data-type"),
                        start:  $(this).val(), // Start range input field
                        end: $(this).parent().find("[name="+elementName+"_end]").val()// End range input field
                        });
                    }
                    else if ($(this).attr("data-type")  == "exact") {
                      filterAsJson.constraints.push({
                        name: $(this).attr("name"),
                        type: "exact",
                        value:  $(this).val() // Start range input field

                        });
                    }
                    else if ($(this).attr("data-type")  == "location") {
                      filterAsJson.constraints.push({
                        name: $(this).attr("name"),
                        type: "location",
                        value:  $(this).data("storage"), // Start range input field
                        radius: $("[name="+$(this).attr("name")+"_radius]").val()
                        });
                    }


                  }
                });

                CharmeModels.SimpleStorage.storeItem("filter", filterAsJson, false, function() {
                  alert("TODO: reload filters without page reload");
                  location.reload();
                  ui_closeBox();
                });
              }
            });
          });
        });
      });

    });
  }
});
