package models;

import android.content.ContentValues;

public class Message {
	/*
		ContentValues values = new ContentValues();
		values.put("content", content);
		values.put("conversationId", conversationId);
		values.put("timestamp", timestamp);
		values.put("author", author);
	 */
	
	public String content;
	public String conversationId;
	public int timestamp;
	public String author;
	
	public String getTimeFromTimestamp()
	{
		return "NOT IMPLEMNETED YET";
	}
	public void setTime(String mongoDbTime)
	{
		System.out.println("TIME IS " +mongoDbTime);
	}
	
	  @Override
  public String toString() {
    return new StringBuilder()

    .append(" author=").append(author)
    .append(", message=").append(content)
    .append("}").toString();
  }
  
	  
}
