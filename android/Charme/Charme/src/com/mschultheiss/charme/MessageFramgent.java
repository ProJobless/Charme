package com.mschultheiss.charme;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

public class MessageFramgent extends Fragment {
	 
	
	@Override
	  public View onCreateView(LayoutInflater inflater, ViewGroup container,
	      Bundle savedInstanceState) {
	    View view = inflater.inflate(R.layout.fragement_message,
	        container, false);
	    return view;
	  }

	  public void setText(String item) {
	  
	  }

}
