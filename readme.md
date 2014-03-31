# Charme

Charme is a distributed and open source social network. In contrast to current social networks you can save your user data on your own server or a server of your choice. Furthermore messages and private information requests are end-to-end encrypted. Client and server are two seperate projects to avoid the server from having access to decrypted information. Client-Server and server-server communication happens via JSON.

**Warning: This is for preview puposes only. This version is NOT stable and NOT secure yet. It will be released after it has been completed and peer reviewed. This will probably take some years.**

The project is splitted into the following sub projects:



<table>
    <tr>
        <td>Path</td>
        <td>Description</td>

    </tr>

   <tr>
        <td>/doc</td>
        <td>Developer Documentation</td>

    </tr>

        <tr>
        <td>/android</td>
        <td>Android App Files</td>

    </tr>

     <tr>
        <td>/demo</td>
        <td>Screenshots and promotion images.</td>

    </tr>

      <tr>
        <td>/jsclient</td>
        <td>HTML5 based client for Encrypted Communication</td>

    </tr>

     <tr>
        <td>/server</td>
        <td>Server for Encrypted Communication</td>

    </tr>

<tr>
        <td>/graph</td>
        <td>Visualisation tools</td>

    </tr>

    
  <tr>
        <td>/web (deprecated)</td>
        <td>Files of the old version.</td>

    </tr>
    
</table>

## Screenshot

![Screenshot](https://raw.github.com/mschultheiss/charme/dev/demo/screen2.png "Screenshot")

## Setup a server

  * Install PHP
  * Make sure short_open_tag is set to true in php.ini, otherwise 
    PHP will not parse php files. 
  * Make sure curl is enabled in php.ini (apt-get install php5-curl)
  * install gd extenstion for wide image library: apt-get install php5-gd
  * Install MongoDB, see http://www.php.net/manual/de/mongo.installation.php
  *  Copy the files on your webserver so that index.php is in the root directory. Note: If you copied the repository, just copy the files in the /server directory on your server.
  * Protect /admin with a .htaccess file
  * Edit config.php. Set a network ID. To be compatible to other beta testers set NETWORK_ID to CHARME_BETA1. You have to read and agree to license_charme.txt when joining networks starting with CHARME.

## Install a client
     * copy the files in the /client directory onto a (local) webserver and access via index.html
     * Please note that Firefox currently has some problems with the textbox for writing messages. Everything shoudl work fine in Chromium/Chrome however.

## Crypto

* We use a RSA/AES cryptosystem to encrypt messages and private data
* The private key is stored on a server, encrypted with a 20 digit passphrase.
* To validate public keys we will implement a Web-Of-Trust like key verification system, that checks if some/all friends of a user own the same public key of him in the background. You currently have to the public keys in the key manager in the client over the menu point Settings/Key Manager.

## How to Contribute?

* Write Code, generate Documentation, check Crypto Concepts
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject

## License
Charme is distributed under the terms of the GNU General Public License,
version 3. See the LICENSE.txt file for details.

## Recommended IDE
Sublime Text 3 with https://github.com/jdc0589/JsFormat plugin.

## Libraries

<table>
    <tr>
        <td>Name</td>
        <td>License</td>
        <td>Filepath</td>
    </tr>

    <tr>
        <td>mongodb.php from Jonathan H. Wage</td>
        <td>BSD</td>
        <td>/server/mongodb.php</td>
    </tr>
        <tr>
        <td>WideImage</td>
        <td>GNU LGPL 2.1. </td>
        <td>/lib/app/3rdparty/wideimage</td>
    </tr>
   <tr>
        <td>Tom Wu's RSA Library</td>
        <td> BSD license</td>
        <td>/jsclient/lib/crypto/</td>
    </tr>
   
    <tr>
        <td>jQuery(UI)</td>
        <td>MIT</td>
        <td>/lib/jq.js and lib/jqui.js</td>
    </tr>
        <tr>
        <td>nanoScroller</td>
        <td>MIT</td>
        <td>embedded in ui.css / ui.js (http://jamesflorentino.github.com/nanoScrollerJS/ for more information)</td>
    </tr>

       <tr>
        <td>nProgressBar</td>
        <td>MIT</td>
        <td>{lib|css}/nprogress.; https://github.com/rstacruz/nprogress</td>
    </tr>


     <tr>
        <td>Backbone.js</td>
        <td>MIT</td>
        <td>/lib/backbone.js</td>
    </tr>
     <tr>
        <td>moment.js</td>
        <td>MIT</td>
        <td>jsclient/lib/moment.js</td>
    </tr>
 <tr>
        <td>doTimeout</td>
        <td>MIT</td>
        <td>jsclient/lib/plugins.js</td>
    </tr>
 <tr>
        <td>autosize.js</td>
        <td>MIT</td>
        <td>jsclient/lib/plugins.js</td>
    </tr>

 <tr>
        <td>Gibberish AES</td>
        <td>MIT</td>
        <td>jsclient/lib/crypto/gibberish.js</td>
    </tr>

 <tr>
        <td>RequireJS</td>
        <td>MIT</td>
        <td>jsclient/lib/require.js</td>
    </tr>

     <tr>
        <td>Symfony (Autoloader)</td>
        <td>MIT</td>
        <td>server/charme/lib/App/ClassLoader</td>
    </tr>


 <tr>
        <td>Tokenizing Autocomplete Text Entry</td>
        <td>MIT</td>
        <td>jsclient/lib/plugins.js</td>
    </tr>

 <tr>
        <td>QRCode.js</td>
        <td>MIT</td>
        <td>jsclient/lib/qrcode.min.js</td>
    </tr>





</table>

