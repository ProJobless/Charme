package com.mschultheiss.charmeapp;

public class StringFormatter {
	public static String shorten(String s, int length)
	{
		if (s.length() < length)
			length = s.length();
		
		return s.substring(0, (length-1));
		
		
	}
}
