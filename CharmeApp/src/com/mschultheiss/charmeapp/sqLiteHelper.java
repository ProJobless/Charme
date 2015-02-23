package com.mschultheiss.charmeapp;

 
import java.util.LinkedList;
import java.util.List;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
 
public class sqLiteHelper extends SQLiteOpenHelper {
 
    private static final int DATABASE_VERSION = 1;
    private static final String DATABASE_NAME = "charmeDB";
 
    public sqLiteHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION); 
    }
     
    
    
    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_BOOK_TABLE = "CREATE TABLE messages ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "content TEXT, "+
                "conversationId TEXT, "+
                "timestamp INTEGER, "+
                "author TEXT )";
        db.execSQL(CREATE_BOOK_TABLE);
    }
 
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS messages");
        this.onCreate(db);
    }
    
    public List<models.Message> getAllMessages(String conversationId) {
    	
    	  List<models.Message> messages = new LinkedList<models.Message>();
    	  
          // 1. build the query
          String query = "SELECT  * FROM message WHERE conversationId='"+conversationId+"'";
   
          // 2. get reference to writable DB
          SQLiteDatabase db = this.getWritableDatabase();
          Cursor cursor = db.rawQuery(query, null);
   
          // 3. go over each row, build book and add it to list
          models.Message book = null;
          if (cursor.moveToFirst()) {
              do {
                  book = new models.Message();
                  //book.setId(Integer.parseInt(cursor.getString(0)));
                  //book.setTitle(cursor.getString(1));
                 // book.setAuthor(cursor.getString(2));
   
                  // Add book to books
                  messages.add(book);
              } while (cursor.moveToNext());
          }
   
          Log.d("getAllMessages()", messages.toString());
   
          // return books
          return messages;
    
    }
    public  void addMessage(String content, String conversationId, int timestamp, String author){

		SQLiteDatabase db = this.getWritableDatabase();

		ContentValues values = new ContentValues();
		values.put("content", content);
		values.put("conversationId", conversationId);
		values.put("timestamp", timestamp);
		values.put("author", author);

		db.insert("messages", // table
		        null, //nullColumnHack
		        values); // key/value -> keys = column names/ values = column values

		db.close();
		}
 
}