package com.mschultheiss.charmeapp;

public class TalkItem {
	public String ID;
	public String Title;
	public String AES;
	public String People;
	public int Count = 0;
	public String ConversationId;
	public TalkItem(String id, String title, String people, String aes, int count , String convId)
	{
		this.Count=count;
		this.ID=id;
		this.Title = title;
		this.People = people;
		this.AES = aes;
		this.ConversationId = convId;
	}
	public void inc()
	{
		Count++;
	}
}
