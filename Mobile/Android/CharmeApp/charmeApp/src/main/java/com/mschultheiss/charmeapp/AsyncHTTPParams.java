package com.mschultheiss.charmeapp;

import android.content.Context;

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
}
