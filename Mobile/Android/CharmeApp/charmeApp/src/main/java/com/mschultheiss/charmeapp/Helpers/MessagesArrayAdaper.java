package com.mschultheiss.charmeapp.Helpers;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.mschultheiss.charmeapp.Controllers.ImageViewer;
import com.mschultheiss.charmeapp.Controllers.TalksMessages;
import com.mschultheiss.charmeapp.Models.MessageItem;
import com.mschultheiss.charmeapp.R;

import java.util.ArrayList;

/**
 * Created by ms on 12/11/15.
 */
public class MessagesArrayAdaper extends ArrayAdapter<MessageItem> {

    private ArrayList<MessageItem> mIdMap = new ArrayList<MessageItem>();
    TalksMessages mContext;

    public MessagesArrayAdaper(TalksMessages context, int textViewResourceId) {
        super(context, textViewResourceId);
        this.mContext = context;
    }

    public int getSize() {
        return mIdMap.size();
    }

    @Override
    public int getCount() {
        return mIdMap.size();
    }

    @Override
    public long getItemId(int position) {

        return position;
    }

    @Override
    public MessageItem getItem(int position) {
        return mIdMap.get(position);
    }

    private ArrayList<MessageItem> tempList = new ArrayList<MessageItem>();

    public void refresh() {
        mIdMap.clear();
        mIdMap.addAll(tempList);
        notifyDataSetChanged();
    }

    public void removeAnswerItems() {
        for (int i = 0; i < tempList.size(); i++) {
            MessageItem mm = (MessageItem) tempList.get(i);
            if (mm.type == 0 && mm.ID == "")
                this.remove(i);
        }
    }

    public void remove(int pos) {
        tempList.remove(pos);
    }

    public void addItem(MessageItem m, int pos) {
        tempList.add(pos, m);
    }

    @Override
    public int getViewTypeCount() {
        return 3; // 0 Message / 1 Show more / 2 Image / 3 Information / ->
        // currently 2, later 4
    }

    @Override
    public int getItemViewType(int position) {
        MessageItem t = mIdMap.get(position);
        if (t == null) {
            return android.widget.Adapter.IGNORE_ITEM_VIEW_TYPE;
        } else
            return t.type;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // --init if not re-cycled--

        final MessageItem t = mIdMap.get(position);
        int type = getItemViewType(position);


        if (type == 0) {
            if (convertView == null
                    ) {
                convertView = LayoutInflater.from(getContext()).inflate(
                        R.layout.talks_messages_row_message, parent, false);
            }

            if (t != null && t.message != null) {


                TextView txtUsername =  (TextView)convertView.findViewById(R.id.textViewUsername);
                TextView txtMessage =  (TextView)convertView.findViewById(R.id.textViewMessage);
                View mainLayout = (View) convertView.findViewById(R.id.mainbox);
                ProgressBar progress = (ProgressBar) convertView.findViewById(R.id.progressSending);

                if (t.isSending)
                    progress.setVisibility(View.VISIBLE);
                else
                    progress.setVisibility(View.GONE);

                txtUsername.setText(t.user);
                txtMessage.setText(t.message);

                float scale = mContext.getResources().getDisplayMetrics().density;
                int dp50 = (int) (50 * scale + 0.5f);
                int dp8 = (int) (8 * scale + 0.5f);

                if (!t.userId.equals(mContext.getCurrentUserId())) {
                    mainLayout.setPadding(dp8, dp8, dp50, 0);
                } else
                    mainLayout.setPadding(dp50, dp8, dp8, 0);

            }

        }
        if (type == 2) { // Image Box
            if (convertView == null
                    || !(convertView.getTag() instanceof ViewHolder3)) {
                convertView = LayoutInflater.from(getContext()).inflate(
                        R.layout.talks_messages_row_images, parent, false);
                convertView.setTag(new ViewHolder3((TextView) convertView
                        .findViewById(R.id.textView1),

                        (ImageView) convertView.findViewById(R.id.imageView1),
                        (LinearLayout) convertView
                                .findViewById(R.id.mainbox)));
            }

            ViewHolder3 holder3 = (ViewHolder3) convertView.getTag();

            if (t != null && holder3 != null) {

                float scale = mContext.getResources().getDisplayMetrics().density;
                int dp50 = (int) (50 * scale + 0.5f);
                ;
                int dp8 = (int) (8 * scale + 0.5f);

                if (!t.userId.equals(mContext.getCurrentUserId())) {
                    holder3.mainbox.setPadding(dp8, dp8, dp50, 0);
                } else
                    holder3.mainbox.setPadding(dp50, dp8, dp8, 0);

                holder3.atext.setText(t.user);


                if (t.image != null)
                    holder3.img.setImageBitmap(t.image);

                holder3.img.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        Intent intent = new Intent(mContext.getBaseContext(),
                                ImageViewer.class);
                        intent.putExtra("fileId", t.fileId);
                        intent.putExtra("aes", mContext.getTheNewestMessageKey());
                        intent.putExtra("server", mContext.getCurrentServer());
                        mContext.startActivity(intent);

                    }
                });
                System.out.println("CHARME: setted onclick img thumb");

            }

        }

        if (type == 1) {
            if (convertView == null
                    || !(convertView.getTag() instanceof ViewHolder2)) {
                convertView = LayoutInflater.from(getContext()).inflate(
                        R.layout.talks_messages_row_more, parent, false);
                convertView.setTag(new ViewHolder2((Button) convertView
                        .findViewById(R.id.button1)));
            }

            ViewHolder2 holder2 = (ViewHolder2) convertView.getTag();
            holder2.shwmore.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    tempList.remove(0); // "adapter before"
                    mContext.loadMessages(false);
                }
            });

        }

        return convertView;




    }

    private static class ViewHolder2 {
        public Button shwmore;
        public ViewHolder2(Button s) {
            this.shwmore = s;
        }
    }

    private static class ViewHolder3 {
        public TextView atext;
        public ImageView img;
        public LinearLayout mainbox;

        private ViewHolder3(TextView text, ImageView img2, LinearLayout mb) {

            this.atext = text;
            this.img = img2;
            this.mainbox = mb;
        }
    }

}