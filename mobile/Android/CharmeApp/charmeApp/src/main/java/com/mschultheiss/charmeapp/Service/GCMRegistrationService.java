package com.mschultheiss.charmeapp.Service;
// Adapted from https://github.com/googlesamples/google-services/tree/master/android/gcm/app/src/main/java/gcm/play/android/samples/com


/**
 * Created by ms on 9/20/15.
 */

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;


import com.google.android.gms.gcm.GcmPubSub;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTP;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTPParams;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

public class GCMRegistrationService extends IntentService {

    private static final String TAG = "RegIntentService";
    private static final String[] TOPICS = {"global"};

    public GCMRegistrationService() {
        super(TAG);
    }
    public static final String PROPERTY_REG_ID = "registration_id";
    public static final String PROPERTY_APP_VERSION = "1";

    /**
     * Sends the registration ID to a CHARME Server over HTTP, so it can use
     * GCM/HTTP or CCS to send messages to your app.
     */
    private void sendRegistrationIdToBackend(final String regId) {
        // apl_request: gcm_registerId
        System.out.println("GCM4: CHARME44 REGISTER IN BG: Send to backend");

        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        String server = sharedPref.getString("server", "");

        try {

            JSONObject object = new JSONObject();
            JSONArray list = new JSONArray();

            JSONObject r1 = new JSONObject();
            r1.put("id", "gcm_register");
            r1.put("regId", regId);

            list.put(r1);

            object.put("requests", list);

            new AsyncHTTP() {

                protected void onPostExecute(String result) {

                    System.out.println("GCM4 RESULT IS:" + result);
                    try {

                        System.out
                                .println("GCM4 CHARME44 REGISTER IN BG: Send to backend completed");

                        System.out
                                .println("GCM4 DEVICE REGISTRED SUCCESFUL FOR GCM");

                    } catch (Exception ex) {
                        System.out.println("GCM4 CHARME ERROR2" + ex.toString());
                    }

                }

            }.execute(new AsyncHTTPParams(object.toString(), this, "", server));
        } catch (Exception ex) {
            System.out.println("GCM4 CHARME1234 ERROR" + ex.toString());
        }

    }
    /**
     * @return Application's version code from the {@code PackageManager}.
     */
    private static int getAppVersion(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager()
                    .getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            // should never happen
            throw new RuntimeException("Could not get package name: " + e);
        }
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);

        try {
            // [START register_for_gcm]
            // Initially this call goes out to the network to retrieve the token, subsequent calls
            // are local.
            // [START get_token]
            InstanceID instanceID = InstanceID.getInstance(this);
            String serverToken = sharedPreferences.getString("GCM_PROJECT_ID", "");


            String token = instanceID.getToken(serverToken,
                    GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);


                    //GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            // [END get_token]
            Log.i(TAG, "GCM Registration Token: " + token);
            if (token.equals(""))
                Log.i(TAG, "CRITCAL ERROR!! GCM Registration is NULL");

            // TODO: Implement this method to send any registration to your app's servers.
            sendRegistrationIdToBackend(token);

            // Subscribe to topic channels
           // subscribeTopics(token);

            // You should store a boolean that indicates whether the generated token has been
            // sent to your server. If the boolean is false, send the token to your server,
            // otherwise your server should have already received the token.
            sharedPreferences.edit().putBoolean("SENT_TOKEN_TO_SERVER", true).apply();
            // [END register_for_gcm]
        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
            // If an exception happens while fetching the new token or updating our registration data
            // on a third-party server, this ensures that we'll attempt the update at a later time.
            sharedPreferences.edit().putBoolean("SENT_TOKEN_TO_SERVER", false).apply();
        }
        // Notify UI that registration has completed, so the progress indicator can be hidden.
        Intent registrationComplete = new Intent("REGISTRATION_COMPLETE");
        LocalBroadcastManager.getInstance(this).sendBroadcast(registrationComplete);
    }

    private void storeRegistrationId(Context context, String regId) {

        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        int appVersion = getAppVersion(context);
        Log.i(TAG, "Saving regId on app version " + appVersion);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(PROPERTY_REG_ID, regId);
        editor.putInt(PROPERTY_APP_VERSION, appVersion);
        editor.commit();
    }

    /**
     * Subscribe to any GCM topics of interest, as defined by the TOPICS constant.
     *
     * @param token GCM token
     * @throws IOException if unable to reach the GCM PubSub service
     */
    // [START subscribe_topics]
    private void subscribeTopics(String token) throws IOException {
        GcmPubSub pubSub = GcmPubSub.getInstance(this);
        for (String topic : TOPICS) {
            pubSub.subscribe(token, "/topics/" + topic, null);
        }
    }
    // [END subscribe_topics]

}
