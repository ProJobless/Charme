package com.mschultheiss.charmeapp.ORM;

import com.mschultheiss.charmeapp.VersionInfo;
import com.orm.SugarRecord;

public class CharmeRequest extends SugarRecord {
	 public  String version;
	 public  String data;
	 public String thekey;
	  
	 public CharmeRequest() // Default Constructor must be retained!
	 {
		 
	 }
	  public CharmeRequest(  String key, String data){
		  
		  
	   this.version = VersionInfo.CHARME_DROID_VERSION;
	   this.data= data;
	   this.thekey = key;
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