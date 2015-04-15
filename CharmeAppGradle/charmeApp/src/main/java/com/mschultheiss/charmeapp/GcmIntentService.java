package com.mschultheiss.charmeapp;

import org.json.JSONObject;

import android.app.IntentService;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;

public class GcmIntentService extends IntentService {
    public static final int NOTIFICATION_ID = 1;
    private NotificationManager mNotificationManager;
    NotificationCompat.Builder builder;

    public GcmIntentService() {
        super("GcmIntentService");
        System.out.println("Starting gcm intent service");
    }
    static final String TAG = "GCMDemo";
    @Override
    protected void onHandleIntent(Intent intent) {
    	
    	System.out.println("Handle intent");
        Bundle extras = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);
        // The getMessageType() intent parameter must be the intent you received
        // in your BroadcastReceiver.
        String messageType = gcm.getMessageType(intent);

        if (!extras.isEmpty()) {  // has effect of unparcelling Bundle
            /*
             * Filter messages based on message type. Since it is likely that GCM
             * will be extended in the future with new message types, just ignore
             * any message types you're not interested in, or that you don't
             * recognize.
             */
            if (GoogleCloudMessaging.
                    MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
                sendNotification("Send error: " + extras.toString());
            } else if (GoogleCloudMessaging.
                    MESSAGE_TYPE_DELETED.equals(messageType)) {
                sendNotification("Deleted messages on server: " +
                        extras.toString());
            // If it's a regular GCM message, do some work.
            } else if (GoogleCloudMessaging.
                    MESSAGE_TYPE_MESSAGE.equals(messageType)) {
                // This loop represents the service doing some work.
                for (int i=0; i<5; i++) {
                    Log.i(TAG, "Working... " + (i+1)
                            + "/5 @ " + SystemClock.elapsedRealtime());
                  
                }
                Log.i(TAG, "Completed work @ " + SystemClock.elapsedRealtime());
                // Post notification of received message.
                sendNotification(extras.getString("message"));
                Log.i(TAG, "Received: " + extras.toString());
            }
        }
        // Release the wake lock provided by the WakefulBroadcastReceiver.
        GcmBroadcastReceiver.completeWakefulIntent(intent);
    }

    // Put the message into a notification and post it.
    // This is just one simple example of what you might choose to do with
    // a GCM message.
    private void sendNotification(String msg) {
    	
    	// 1. get message ID!
    	
    	
    	/*Received: Bundle[{message=newmessage:532075d4d8cc9a646cbccf22, 
    			android.support.content.wakelockid=1, 
    			collapse_key=do_not_collapse, from=987346853523}]
*/	
    	try
    	{
    		
    		
        	// First parse JSON 
        	
        	// If we are in talks.java, and message is NEWCONV -> Reload list!
        	
        	
        	// If it is an open conversation and Message Id matches -> Call the checkNewMessages() function
        	
        	
        	
        	// Make status message notification:
        	
        	
        	// Send Broadcast
    		
    		
    	JSONObject jo = new JSONObject(msg);
    	
    	// messageEnc, messageId, sendername
    	
     	System.out.println("CHARME54 recieved GCM Message:"+msg);
        mNotificationManager = (NotificationManager)
                this.getSystemService(Context.NOTIFICATION_SERVICE);
        
        
        Intent ii =  new Intent(this, TalksMessages.class);
       
        ii.putExtra("conversationId", jo.getString("conversationId").toString());
        System.out.println("CONV 3 is"+jo.getString("conversationId").toString());
        // Get aes by superid from storage
        
      //  ii.putExtra("aes", value);
       // ii.putExtra("superId", value);
        
      
        
     
        Intent intent = new Intent();
        intent.setAction("com.mschultheiss.charmeapp.actions.newmessage");
        intent.putExtra("conversationId", jo.getString("conversationId").toString());
        sendBroadcast(intent);
        
        
        
        
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
               ii , PendingIntent.FLAG_CANCEL_CURRENT); // PendingIntent.FLAG_CANCEL_CURRENT is necessary for putExtra

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
        .setSmallIcon(R.drawable.ic_launcher)
        .setContentTitle(jo.getString("sendername"))
        
        .setStyle(new NotificationCompat.BigTextStyle()
        .bigText(msg))
        .setContentText(msg);

        mBuilder.setContentIntent(contentIntent);
        mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
        
        
    	}
    	catch(Exception ee){}
    
    	
    	
   
    }
}