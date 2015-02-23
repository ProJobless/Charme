package com.mschultheiss.charmeapp;

import org.json.JSONObject;

import com.mschultheiss.charmeapp.TalksMessages.MessageItem;

import uk.co.senab.photoview.PhotoViewAttacher;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.Menu;
import android.widget.ImageView;

public class ImageViewer extends Activity {
	
	ImageView mImageView;
	PhotoViewAttacher mAttacher;
	GibberishAESCrypto gib = new GibberishAESCrypto();
	String msgaes;
	String fileId;
	
	public Bitmap content = null;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_image_viewer);
		
	    mImageView = (ImageView) findViewById(R.id.imageView1);
		mAttacher = new PhotoViewAttacher(mImageView);
		
		
		Intent intent = getIntent();
		msgaes = intent.getStringExtra("aes");
		fileId= intent.getStringExtra("fileId");
		
		if (savedInstanceState != null) 
		{
			content = (Bitmap) savedInstanceState.getParcelable("bitmap");
			mImageView.setImageBitmap(content);
        	mAttacher.update();
		}
		else
		{
		
		JSONObject object = new JSONObject();
		AsyncHTTPParams param = new AsyncHTTPParams(object.toString(), this, "");
		param.Url = "http://192.168.43.31/charme/fs.php?enc=1&id="+fileId+"&type=original"; // The url of the image

		new AsyncHTTP() {
			@Override
			protected void onPostExecute(String result) {
				try {
					System.out.println("CHARME4 img fid:"+fileId); 
					System.out.println("CHARME4 img there, aes: "+msgaes+"+result:"+result);
					String imageData = gib.decrypt( result, msgaes.toCharArray()).replaceFirst("^data:image/[^;]*;base64,?","");
					byte[] bytes =  Base64.decode(imageData , Base64.DEFAULT);

					final Bitmap decodedByte = BitmapFactory.decodeByteArray(bytes, 0, bytes.length); 
					
					

					ImageViewer.this.runOnUiThread(new Runnable() {

				        @Override
				        public void run() {
				        	
				        	content = decodedByte;
				        	mImageView.setImageBitmap(decodedByte);
				        	mAttacher.update();
				           
				        }
				    });

				} catch (Exception ex) {
					System.out.println("CHARME IMAGE" + ex.toString());
				}

			}
		}.execute(param);
		}
		
		
		
	}
	public void onSaveInstanceState(Bundle outState) {
	    outState.putParcelable("bitmap", content);
	}
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.image_viewer, menu);
		return true;
	}

}
