package com.mschultheiss.charmeapp.ORM;

import com.mschultheiss.charmeapp.VersionInfo;
import com.orm.SugarRecord;

public class CharmeMessage extends SugarRecord {
	 public  String authorname;
	 public  String messageJSON;
	 public  String conversationId;
	  
	 public CharmeMessage() // Default Constructor must be retained!
	 {
		 
	 }
	  public CharmeMessage(String authorname, String messageContent, String conversationId){
		  
		  
	   this.authorname =authorname;
	   this.messageJSON = messageContent;
	   this.conversationId = conversationId;
	 
	  }
	  
	// Make it Thread Safe:
	/*	@Override
		public synchronized void delete() {
		    super.delete();
		}

		@Override
		public synchronized long save() {
			return super.save();
		}*/
		
		
}