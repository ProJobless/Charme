package com.mschultheiss.charmeapp;

import android.content.Context;

public class AsyncHTTPParams {
   
	public String PostData;
	public String Url;
	public Context Context;
	public String storageId;
	
    public AsyncHTTPParams(String d, Context cc, String storageId) {
        this.PostData = d;
        this.Context = cc;
        this.storageId = storageId;
        this.Url="";
        
 
    }
}
