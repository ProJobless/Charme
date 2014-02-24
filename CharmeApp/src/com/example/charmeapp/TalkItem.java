package com.example.charmeapp;

public class TalkItem {
	public String ID;
	public String Title;
	public String AES;
	public String People;
	public TalkItem(String id, String title, String people, String aes)
	{
		this.ID=id;
		this.Title = title;
		this.People = people;
		this.AES = aes;
	}
}
