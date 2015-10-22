package com.mschultheiss.charmeapp.Models;

import android.content.Context;
import com.mschultheiss.charmeapp.Crypto.Crypto;
import com.mschultheiss.charmeapp.Crypto.GibberishAESCrypto;
import org.json.JSONObject;

/**
 * Created by ms on 10/2/15.
 */

public class PersonItem {

    public String UserId;
    public String Name;
    public String edgekeyWithPublicKey;
    public JSONObject edgekeyWithFK;
    public String publicKeyRevision;

    public boolean isSelected = false;

    public PersonItem(JSONObject json) {
            try {
                JSONObject obj = json.getJSONObject("key").getJSONObject("obj");

                this.UserId = obj.getString("publicKeyUserId");
                this.Name = obj.getString("username");
                this.edgekeyWithPublicKey = obj.getString("edgekeyWithPublicKey");
                this.publicKeyRevision = obj.getString("publicKeyRevision");
                this.edgekeyWithFK = obj.getJSONObject("edgekeyWithFK");
            }
            catch (Exception x) {

            }
    }

    public JSONObject makeCryptoObject(String messageKey, Context context) {
        try {
            JSONObject key = new JSONObject();
            key.put("userId", UserId);
            System.out.println("PUT USER OBJECT FOR USER"+UserId);
            key.put("revisionB", publicKeyRevision);
            key.put("rsaEncEdgekey", edgekeyWithPublicKey);

            // 1. Get fastkey1 for specified revision and decrypt edgekeyWithFK with fastKey1
            // 2. Use this key to get edgekey
            Crypto.DecryptReturn edgekeyObj = Crypto.decryptFastKey1(edgekeyWithFK, context);

            if (edgekeyObj == null) {
                System.out.println("Warning: Edgekey is null! Aborting PersonItem.makeCryptoObject()...");
                return null;

            }
            String edgekey = edgekeyObj.message;

            // 3. Encrypt message key with edgekey
            GibberishAESCrypto gibs = new GibberishAESCrypto();
            String messageKeyEncryptedWithEdgekey = gibs.encrypt(messageKey, edgekey.toCharArray());
            key.put("messageKey", messageKeyEncryptedWithEdgekey);

            return key;

            /*
                    Some reference code copied from the web client.

            		var edgekey = crypto_decryptFK1(item.key.obj.edgekeyWithFK).message;
		            var messageKeyEnc = aes_encrypt(edgekey, messageKey);

                    peopleMessageKeys.push({
                        messageKey: messageKeyEnc,
                        userId: item.key.obj.publicKeyUserId,
                        rsaEncEdgekey: item.key.obj.edgekeyWithPublicKey,
                        revisionB: item.key.obj.publicKeyRevision
                    });

                    }
             */

        }
        catch(Exception x) {
            x.printStackTrace();
            return null;
        }
    }

    public JSONObject makeJSON() {

        try {
            JSONObject json = new JSONObject();
            json.put("name", Name);
            json.put("userId", UserId);

            return json;
        }
        catch(Exception x) {
            return null;
        }
    }
}
