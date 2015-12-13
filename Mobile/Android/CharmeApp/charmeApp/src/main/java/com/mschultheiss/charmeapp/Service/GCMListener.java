// Adapted from https://github.com/googlesamples/google-services/tree/master/android/gcm/app/src/main/java/gcm/play/android/samples/com

package com.mschultheiss.charmeapp.Service;


import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import android.content.SharedPreferences;

import android.preference.PreferenceManager;

import org.json.JSONObject;

import com.mschultheiss.charmeapp.Controllers.TalksMessages;
import com.google.android.gms.gcm.GcmListenerService;
import com.mschultheiss.charmeapp.Crypto.GibberishAESCrypto;
import com.mschultheiss.charmeapp.R;

/**
 * Created by ms on 9/20/15.
 */
public class GCMListener extends GcmListenerService {
    public static final int NOTIFICATION_ID = 1;
    private static final String TAG = "MyGcmListenerService";

    /**
     * Called when message is received.
     *
     * @param from SenderID of the sender.
     * @param data Data bundle containing message data as key/value pairs.
     *             For Set of keys use data.keySet().
     */
    // [START receive_message]
    @Override
    public void onMessageReceived(String from, Bundle data) {
        String message = data.getString("message");
        Log.d(TAG, "From: " + from);
        Log.d(TAG, "Message: " + message);

        if (from.startsWith("/topics/")) {
            // message received from some topic.
        } else {
            // normal downstream message.
        }

        // [START_EXCLUDE]
        /**
         * Production applications would usually process the message here.
         * Eg: - Syncing with server.
         *     - Store message in local database.
         *     - Update UI.
         */

        /**
         * In some cases it may be useful to show a notification indicating to the user
         * that a message was received.
         */
        sendNotification(message);
        // [END_EXCLUDE]
    }
    // [END receive_message]

    /**
     * Create and show a simple notification containing the received GCM message.
     *
     * @param message GCM message received.
     */
    private NotificationManager mNotificationManager;

    private void sendNotification(String msg) {
        try
        {


            // First parse JSON

            // If we are in talks.java, and message is NEWCONV -> Reload list!


            // If it is an open conversation and Message Id matches -> Call the checkNewMessages() function



            // Make status message notification:


            // Send Broadcast


            JSONObject jo = new JSONObject(msg);

            // messageEnc, messageId, sendername

            System.out.println("GCM4  recieved GCM Message:"+msg);
            mNotificationManager = (NotificationManager)
                    this.getSystemService(Context.NOTIFICATION_SERVICE);


            Intent ii =  new Intent(this, TalksMessages.class);


            ii.putExtra("conversationId", jo.getString("conversationId").toString());
            System.out.println("CONV 3 is"+jo.getString("conversationId").toString());
            // Get aes by superid from storage

            //  ii.putExtra("aes", value);
            // ii.putExtra("superId", value);
            SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
            String ringToneName = preferences.getString("notifications_new_message_ringtone", "DEFAULT_SOUND");



            Intent intent = new Intent();
            intent.setAction("com.mschultheiss.charmeapp.actions.newmessage");
            intent.putExtra("conversationId", jo.getString("conversationId").toString());
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);

            SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
            String aeskey = sharedPref.getString("conv_"+jo.getString("conversationId").toString(), ""); // TODO: This is not secure if the device is stolen etc!!!

            System.out.println("aeskey is "+aeskey);

            if (aeskey != "")
            {
                try {

                    GibberishAESCrypto gib = new GibberishAESCrypto();
                    msg = gib.decrypt(jo.getString("messageEnc"), aeskey.toCharArray());
                }
                catch(Exception ee){
                    msg = "New message";
                }

            }
            else
                msg = "New message";


            if (preferences.getBoolean("notifications_new_message", true)) {

                if (sharedPref.getString("currentConversation", "ldknzx;lwqn").equals(jo.getString("conversationId").toString())  )  // Do not show notification if message activity of this converation already in foreground
                {
                    PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
                            ii, PendingIntent.FLAG_CANCEL_CURRENT); // PendingIntent.FLAG_CANCEL_CURRENT is necessary for putExtra

                    NotificationCompat.Builder mBuilder =
                            new NotificationCompat.Builder(this)
                                    .setSmallIcon(R.mipmap.ic_launcher)
                                    .setContentTitle(jo.getString("sendername"))

                                    .setStyle(new NotificationCompat.BigTextStyle()
                                            .bigText(msg))
                                    .setContentText(msg);

                    mBuilder.setContentIntent(contentIntent);


                    mBuilder.setSound(Uri.parse(ringToneName));

                    if (preferences.getBoolean("notifications_new_message_vibrate", true))
                        mBuilder.setVibrate(new long[]{250, 250});


                    mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
                }
            }





        }
        catch(Exception ee){}


    }
}