package com.mschultheiss.charmeapp.Helpers;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class AsyncHTTPParams {
   
	public String PostData;
	public String Server;
	public Context Context;
	public String storageId;
	public String Url;

    public AsyncHTTPParams(String d, Context cc, String storageId, String server) {
        this.PostData = d;
        this.Context = cc;
        this.storageId = storageId;
        this.Server=server;


 
    }
    public AsyncHTTPParams(String d, Context cc, String storageId, Context context) {
        this.PostData = d;
        this.Context = cc;
        this.storageId = storageId;
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        this.Server=   sharedPref.getString("server", "");



    }



}
