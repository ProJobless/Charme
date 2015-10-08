package com.mschultheiss.charmeapp.Models;

import android.content.Context;
import android.provider.SyncStateContract;

import com.mschultheiss.charmeapp.Helpers.GroupTools;

import org.json.JSONArray;

public class TalkItem {
	public String ID;
	public String Title;
	public String AES;
	public JSONArray People;
	public JSONArray Usernames;
	public int Count = 0;
	public String ConversationId;
	public TalkItem(String id, String title, JSONArray people,  JSONArray usernames, String aes, int count , String convId)
	{
		this.Count=count;
		this.ID=id;
		this.Title = title;
		this.People = people;
		this.AES = aes;
		this.Usernames = usernames;
		this.ConversationId = convId;
	}
	public String getPeopleAsName() {
		return GroupTools.getNameByReceivers(this.Usernames);

	}
	public int getImageResource(Context context) {
		int r = GroupTools.getImageByReceivers(this.People, context);
		System.out.println("R is "+r);
		return r;
	}
	public void inc()
	{
		Count++;
	}
}
