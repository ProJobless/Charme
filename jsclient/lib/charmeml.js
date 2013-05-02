(function($)
{
	// Syntax: <!-- http://www.regextester.com/jssyntax.html -->

    $.charmeMl = function(str, options) 
    {
    	// Default options
	    var settings = $.extend( {
	      'tags'         : ["b", "i", "u", "href"]
	    }, options);


	    // Regex Definitions in form pattern, replace
		var search  = new Array(
		new Array(/\*\*(.*?)\*\*/g, "<b>$1</b>", "b"),
		new Array(/\-\-(.*?)\-\-/g, "<i>$1</i>", "i"),
		new Array(/\_\_(.*?)\_\_/g, "<u>$1</u>", "u"),
		new Array(/(\b(http|https|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1'>$1</a>", "href")
		);


		for (i = 0; i < search.length; i++) {


			if ($.inArray(search[i][2], settings.tags) > -1)
		    str = str.replace(search[i][0], search[i][1]);
		}

		// Convert \n to <br>
		var br = '<br/>';
		str =  (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + br + '$2');

		return str;
    };


})(jQuery);