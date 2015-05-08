package com.mschultheiss.charmeapp;


import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.LinkedList;
import java.util.List;

// TODO: Check if sqLite threadsafe.

public class sqLiteHelper extends SQLiteOpenHelper {

    private static final int DATABASE_VERSION = 25;
    private static final String DATABASE_NAME = "charmeDB";

    public sqLiteHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_BOOK_TABLE = "CREATE TABLE messages ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "content TEXT, " +
                "conversationId TEXT, " +
                "mtimestamp REAL, " +
                "author TEXT, " +
                "hasFile INTEGER, " +
                "userId TEXT, " +
                "fileId TEXT, " +
                "messageId TEXT UNIQUE )";
        db.execSQL(CREATE_BOOK_TABLE);

        String CREATE_TABLE_FILES = "CREATE TABLE files ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "conversationId TEXT, " +
                "messageId TEXT UNIQUE, " +
                "fileBlob TEXT, " +
                "userId TEXT ) ";

        db.execSQL(CREATE_TABLE_FILES);


    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS messages");
        db.execSQL("DROP TABLE IF EXISTS files");
        this.onCreate(db);
    }
    public String getFileBlob(String messageId)
    {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT fileBlob FROM files WHERE messageId='"+messageId+"'", null);
        if (cursor.moveToFirst()) {
            do {
               return cursor.getString(0);

            } while (cursor.moveToNext());
        }
        return "";
    }
    public List<models.Message> getAllMessages(String query) {

        List<models.Message> messages = new LinkedList<models.Message>();

        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(query, null);

        models.Message m = null;
        if (cursor.moveToFirst()) {
            do {

                m = new models.Message();
                m.content = cursor.getString(1);
                m.conversationId = cursor.getString(2);
                m.timestamp = cursor.getDouble(3);
                m.author = cursor.getString(4);
                m.hasFile = cursor.getInt(5);
                m.userId = cursor.getString(6);
                m.messageId = cursor.getString(8);
                m.fileId = cursor.getString(7);
                messages.add(m);
            } while (cursor.moveToNext());
        }

        Log.d("getAllMessages()", messages.toString());

        // return books
        return messages;

    }
    public List<models.Message> getAllMessages() {

        return getAllMessages("SELECT  * FROM messages");

    }


    public List<models.Message> getAllMessages(String conversationId, double lastTime) {
 //  AND mtimestamp BETWEEN 0 AND "+String.valueOf(lastTime)+ "   1.425407873E9

        return getAllMessages("SELECT  * FROM messages WHERE mtimestamp<"+String.valueOf(lastTime)+" AND conversationId LIKE '" + conversationId + "'  ORDER BY mtimestamp DESC LIMIT 10"); //  AND timestamp<'" + String.valueOf(lastTime) + "' ORDER BY timestamp DESC LIMIT 10

    }
    public void addFile(String conversationId, String messageId, String fileBlob, String userId)
    {

        SQLiteDatabase db = this.getWritableDatabase();
        try {


            ContentValues values = new ContentValues();
            values.put("fileBlob", fileBlob);
            values.put("userId", userId);
            values.put("conversationId", conversationId);
            values.put("messageId", messageId);
            db.insert("files", // table
                    null, //nullColumnHack
                    values);

        }catch(Exception es){

        }
        finally {
            db.close();
        }


    }

    public void addMessage(String content, String conversationId, double timestamp, String author, String messageId, int hasFile, String userId, String fileId) {


        SQLiteDatabase db = this.getWritableDatabase();
        try {


            ContentValues values = new ContentValues();
            values.put("content", content);
            values.put("conversationId", conversationId);
            values.put("mtimestamp", timestamp);
            values.put("author", author);
            values.put("messageId", messageId);
            values.put("hasFile", hasFile); // 0 no, 1 yes
            values.put("userId", userId);
            values.put("fileId", fileId);
            db.insert("messages", // table
                    null, //nullColumnHack
                    values);

        }catch(Exception es){

        }
        finally {
            db.close();
        }

    }

}