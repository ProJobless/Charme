package com.mschultheiss.charme;

import java.util.ArrayList;

import android.content.Context;
import android.text.Spanned;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;


public class ChatListAdapter extends BaseAdapter {
	
	private ArrayList<Spanned> theComments;
	private Context theContext;
	
	public ChatListAdapter(Context context, ArrayList<Spanned> comments) {
		this.theContext = context;
		this.theComments = comments;		
	}
	
	public View getView(final int position, View cView, ViewGroup parent){
		
		View view = cView;
		if (view == null) {
			LayoutInflater inflater = (LayoutInflater) theContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			view = inflater.inflate(R.layout.message_item, null);			
		}
		
		final Spanned item = theComments.get(position);
		
		TextView fans_image = (TextView) view.findViewById(R.id.item_text);
		fans_image.setText(item);
		
		return view;
		 
		
	}
	@Override
	public Object getItem(int position) {		
		return theComments.get(position);
	}
	
	
	@Override
	public int getCount() {		
		return theComments.size();
	}
	
	
	@Override
	public long getItemId(int position) {		
		return position;
	}	
}
