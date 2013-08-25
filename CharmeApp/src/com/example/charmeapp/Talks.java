package com.example.charmeapp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

public class Talks extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_talks);
		
		  final ListView listview = (ListView) findViewById(R.id.listView1);
		  
		  final ArrayList<TalkItem> list = new ArrayList<TalkItem>();
		  
		  
		  for (int i = 0; i<10;i++)
		  {
			  list.add(new TalkItem("lala", "Mein Talk 1", "lalalala"));
			  list.add(new TalkItem("lala", "Mein Talk 1", "lalalala"));
			  list.add(new TalkItem("lala", "Mein Talk 1", "lalalala"));
		  }
		  
		  
		  
		  final StableArrayAdapter adapter = new StableArrayAdapter(this,
			      R.layout.activity_talks_listitem, list);
			    listview.setAdapter(adapter);
			    
			    
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.talks, menu);
		return true;
	}

	private class StableArrayAdapter extends ArrayAdapter<TalkItem> {

		HashMap<Integer, TalkItem> mIdMap = new HashMap<Integer, TalkItem>();
		Context mContext;

		public StableArrayAdapter(Context context, int textViewResourceId,
				List<TalkItem> objects) {

			super(context, textViewResourceId, objects);

			this.mContext = context;

			for (int i = 0; i < objects.size(); ++i) {
				mIdMap.put(i, objects.get(i));
			}
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {

			TalkItem t = mIdMap.get(position);

			LayoutInflater inflater = (LayoutInflater) mContext
					.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			View rowView = inflater.inflate(R.layout.activity_talks_listitem,
					parent, false);
			ImageView imageView = (ImageView) rowView.findViewById(R.id.icon);
			TextView textView = (TextView) rowView.findViewById(R.id.label);
			textView.setText(t.Title);

			return rowView;

		}

		@Override
		public boolean hasStableIds() {
			return true;
		}

	}

}
