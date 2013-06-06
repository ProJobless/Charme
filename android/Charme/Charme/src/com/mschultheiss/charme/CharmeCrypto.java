package com.mschultheiss.charme;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.security.KeyPair;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.shell.Global;

public class CharmeCrypto {
	
	public KeyPair RSA;
	public static String EncryptRSA(String message)
	{
		//PublicKey publicKey = new PublicK
		//KeyPair keyPair = new KeyPair(publicKey, privateKey);
		
		
		return "";
	}
	public static String DecryptRSA(String message)
	{
		
		return  "";
	}

	 private static Context createAndInitializeContext(Global global) {
	        Context context = ContextFactory.getGlobal().enterContext();
	        global.init(context);
	        context.setOptimizationLevel(-1);
	        context.setLanguageVersion(Context.VERSION_1_5);
	        return context;
	    }
	 
	public static void encryptAES(String cryptedText, String key)
	{
        try
        {
			
		   	Global global = new Global();
	        Context context  = createAndInitializeContext( global );
	        Scriptable scope = context.initStandardObjects( global );
	 
	        URL url = new URL("https://github.com/bitwiseshiftleft/sjcl/raw/version-0.8/sjcl.js");
	        BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
	        compileAndExec(in, "classpath:" + url.toString(), context, scope);
	        in.close();
	        exec("var result = sjcl.encrypt('password', 'data')", "start", context,scope);
	        Object result = scope.get("result", scope);
	        if (result != Scriptable.NOT_FOUND) {
	            String json =  Context.toString(result);
	           	System.out.println("CHARME JSON");
	            System.out.println(json);
	        }
	        
        }
        catch(Exception ex)
        {
        	System.out.println("CHARME ERROR 42");
        }
		
	}
	public static void exec(String script, String name, Context context, Scriptable scope) {
        context.compileString(script, name, 1, null).exec(context,scope);
    }
    public static void compileAndExec(Reader in, String name, Context rhinoContext, Scriptable scope) throws IOException {
        rhinoContext.compileReader(in, name, 1, null).exec(rhinoContext,scope);
    }
	
	
    
   public static String bytesToHex(byte[] bytes) {
	    final char[] hexArray = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
	    char[] hexChars = new char[bytes.length * 2];
	    int v;
	    for ( int j = 0; j < bytes.length; j++ ) {
	        v = bytes[j] & 0xFF;
	        hexChars[j * 2] = hexArray[v >>> 4];
	        hexChars[j * 2 + 1] = hexArray[v & 0x0F];
	    }
	    return new String(hexChars);
	}
	 public static byte[] hexStringToByteArray(String s) {
	    byte[] b = new byte[s.length() / 2];
	    for (int i = 0; i < b.length; i++) {
	      int index = i * 2;
	      int v = Integer.parseInt(s.substring(index, index + 2), 16);
	      b[i] = (byte) v;
	    }
	    return b;
	  }
	
}
