/*

  View for post item.

*/




(function($){
  // **ListView class**: Our main app view.
  Notification = Backbone.View.extend({   

    json: '',
   

    initialize: function(){
      

      this.render();
    },
     render: function(){
        // get plain database json

        // Set counts

     }

    });


    PostViewContainer = Backbone.View.extend({   

    ownerid: '',
    collectionid: '',
    start: 0,

    initialize: function(){

    },
     render: function(){

     }

    });



     PostView = Backbone.View.extend({    
      el: $('body'),
      content : 'TEST',
      userid : '',
      username: '',
      postid: 0, 
      timestr: "now",
      json: null,
      sessionuser: "",
      initialize: function(){
        _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

        if (this.options.json != null)
        {
          // Fill from JSON...

        }

         this.render(); // not all views are self-rendering. This one is.
      },
    
      render: function(){


        /*

      return array("<div id='post".$obj["_id"]."'><a class='delete' onclick='deletePost(\"".$obj["_id"]."\")'> </a>".$img."
    
    <a href='/?p=profile&q=about&userId=".urlencode($obj["userid"])."'>".$obj["username"]."</a><div class='cont'>".$obj["content"]."</div>
      <div>".$atta."
        <span class='time'>".supertime($ttime)."</span>
         <a onclick='displayCommentBox(this, \"".$commentId."\", \"".$obj["_id"]."\")'>Comments <span class='countComments'>(2)</span></a>
          - <a onclick='lovePost(this)'>Love</a>
      ".commentBox($obj["_id"], $commentId).$img2." </div></div>", 2);

        */
        var str = "<div class='collectionPost' id='post"+this.options.postid+"' ><a class='delete' onclick='deletePost(\""+this.options.postid+"\")'> </a><div class='cont'>"+this.options.content+"</div>";

//TODO:  Add username and image if in stream


str += "<span class='time'>"+this.options.timestr+"</span>";
str += "<a onclick='displayCommentBox(this, \""+this.options.sessionuser+"\", \""+this.options.postid+"\")'>";

str += "Comments <span class='countComments'>(2)</span></a>  - <a onclick='lovePost(this)'>Love</a>";

        $(this.el).prepend(str);
      }
    });



    
})(jQuery);
