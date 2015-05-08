package com.mschultheiss.charmeapp;

import org.json.JSONObject;

public class AsyncCryptoArgs {
	
	public final static int ACTION_ENCRYPT = 0x0;
	public final static int ACTION_DECRYPT = 0x1;
	public final static int ACTION_SIGN = 0x2;

	public RSAObj RSA;
	public int Action;
	public String TextToProcess;
	public int Revision;
	public JSONObject JSON;
	

	
	   public AsyncCryptoArgs(RSAObj rsa, String textToProcess, int action, int revision) {
    	
    
    	this.TextToProcess = textToProcess;
    	this.Action =action;
    	this.RSA = rsa;
    	this.Revision = revision;
    	
    }
	
	
    public AsyncCryptoArgs(RSAObj rsa, JSONObject json, int action) {
    	
    
    	this.JSON = json;
    	this.Action =action;
    	this.RSA = rsa;

    	
    }
    
}
