package com.mschultheiss.charmeapp.Models;

import android.graphics.Bitmap;

import com.mschultheiss.charmeapp.Helpers.sqLiteHelper;

/**
 * Created by ms on 11/15/15.
 */

    public class MessageItem {


        public MessageItem(String msg, String username, String uid, int typ,
                           String id, double timestamp) {
            this.message = msg;
            this.user = username;
            this.type = typ;
            this.ID = id;
            this.userId = uid;
            this.timestamp = timestamp;


        }
        public void saveToDatabase(sqLiteHelper sqd, String conversationId)
        {
            try {

                sqd.addMessage(message, conversationId, timestamp, this.user, this.ID, this.hasFile, this.userId, this.fileId); // last argumeent is fileId
            }
            catch(android.database.sqlite.SQLiteConstraintException ex){ System.out.println("CHARME INFO: DB Lite failed, entry probably already exists.");}
        }
        public boolean isSending = false;
        public double timestamp;
        public String ID;
        public Bitmap image;
        public String fileId;

        public String user;
        public String userId;
        public int hasFile = 0;
        public String message;
        public int type; // Message / Image / Information / Show more

        public enum MESSAGE_STATUS{
            SENDING,
            SENT
        }



}


