package com.mschultheiss.charmeapp;

/**
 * Created by ms on 2/28/15.
 */

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

// Cookie Store Manager, see http://stackoverflow.com/questions/19119086/android-persisting-server-session-using-cookie-when-making-http-calls
public class CookieStoreManager implements CookieStore {

    private static final String LOGTAG = "CHARME COOKIESTORE";


    private Map<String, Map<String, String>> mapCookies = new HashMap<String, Map<String, String>>();
    private   SharedPreferences sharedPrefs;

    public void add(URI uri, HttpCookie cookie) {

        String domain = cookie.getDomain();
        System.out.println("COOKIE ADD DOMAIN IS "+domain);

        System.out.println("COOKIE SAVE:"+cookie.getName());
        // Log.i(LOGTAG, "adding ( " + domain +", " + cookie.toString() );

        Map<String, String> cookies = mapCookies.get(domain);
        if (cookies == null) {
            cookies = new HashMap<String, String>();
            mapCookies.put(domain, cookies);
        }

        if (!cookie.getName().startsWith("PHPSESSID") && !cookie.getValue().equals(""))
            cookies.put(cookie.getName(), cookie.getValue());


    }

    public CookieStoreManager(Context ctxContext) {

        // This may become a problem as ctxContext is first activity opened
        sharedPrefs = ctxContext.getSharedPreferences("CHARME_COOKIE_PREFERENCES", Context.MODE_PRIVATE);
    }

    public List<HttpCookie> get(URI uri) {

        List<HttpCookie> cookieList = new ArrayList<HttpCookie>();

        String domain = uri.getHost();
        System.out.println("COOKIE GET DOMAIN IS "+domain);
        // Log.i(LOGTAG, "getting ( " + domain +" )" );

        Map<String, String> cookies = mapCookies.get(domain);
        if (cookies == null) {
            cookies = new HashMap<String, String>();
            mapCookies.put(domain, cookies);
        }

        for (Map.Entry<String, String> entry : cookies.entrySet()) {

            if (entry.getKey().equals("PHPSESSID"))
            {
                cookieList.add(new HttpCookie(entry.getKey(), sharedPrefs.getString("PHPSESSID", "")));
            }
            else
                cookieList.add(new HttpCookie(entry.getKey(), entry.getValue()));

            System.out.println("COOKIE GET  returning cookie: " + entry.getKey() + "="+ entry.getValue());
        }
        return cookieList;

    }

    public boolean removeAll() {


        mapCookies.clear();
        return true;

    }


    public List<HttpCookie> getCookies() {

        Log.i(LOGTAG, "getCookies()");

        Set<String> mapKeys = mapCookies.keySet();

        List<HttpCookie> result = new ArrayList<HttpCookie>();
        for (String key : mapKeys) {
            Map<String, String> cookies = mapCookies.get(key);
            for (Map.Entry<String, String> entry : cookies.entrySet()) {

                if (entry.getKey().equals("PHPSESSID"))
                {
                    System.out.println("cookie" +
                            " SAVED SESSION IS " + sharedPrefs.getString("PHPSESSID", ""));

                    result.add(new HttpCookie(entry.getKey(), sharedPrefs.getString("PHPSESSID", "")));
                }
                else
                result.add(new HttpCookie(entry.getKey(), entry.getValue()));

                Log.i(LOGTAG, "returning cookie: " + entry.getKey() + "=" + entry.getValue());
            }
        }

        return result;

    }


    public List<URI> getURIs() {

        Log.i(LOGTAG, "getURIs()");

        Set<String> keys = mapCookies.keySet();
        List<URI> uris = new ArrayList<URI>(keys.size());
        for (String key : keys) {
            URI uri = null;
            try {
                uri = new URI(key);
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
            uris.add(uri);
        }
        return uris;

    }


    public boolean remove(URI uri, HttpCookie cookie) {

        String domain = cookie.getDomain();

        Log.i(LOGTAG, "remove( " + domain + ", " + cookie.toString());

        Map<String, String> lstCookies = mapCookies.get(domain);

        if (lstCookies == null)
            return false;

        return lstCookies.remove(cookie.getName()) != null;

    }

}