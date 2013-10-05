# Charme


Charme is a distributed and open source social network. In contrast to classic social networks you can save your user data on your own server or a server of your choice. The project is splitted into the following sub projects:

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


## Installation

  * Install PHP
  * Make sure short_open_tag is set to true in php.ini, otherwise 
    PHP will not parse php files. 
  *  Make sure curl is enabled in php.ini (apt-get install php5-curl on debian apache2)
  * install gd extenstion for wide image: apt-get install php5-gd
  * Install MongoDB, see http://www.php.net/manual/de/mongo.installation.php
  *  Copy the files on your webserver so that index.php is in the root directory. Note: If you copied the repository, just copy the files in the /server directory on your server.
  * Protect /admin with a .htaccess file
  * Edit config.php. Set a network ID. To be compatible to other beta testers set NETWORK_ID to CHARME_BETA1. You have to read and agree to license_charme.txt when joining networks starting with CHARME.


## Version


<<<<<<< HEAD
**Warning: This version is for preview puposes only. This version is NOT stable and misses essential functions like a public key manager.
=======
**Warning: This version is for preview puposes only. This version is NOT stable and misses essential security functions like public key managment.
>>>>>>> f283020b432699a3cb6ef010b19e41b671b8577a
We plan to release a stable version by summer 2014.**

## Crypto

* We use a RSA/AES Cryptosystem to encrypt messages and privat data
* The private key is stored on a server, encrypted with a 20 digit passphrase. You may criticise now, that an attacker can decrypt all your messages, when he finds out your passphrase, but this also happens when he finds out your facebook password or private PGP key.
* To validate public keys we will implement a Web-Of-Trust like key veryfication system, that checks if all friends of a user own the same public key of him in the Background. You can also manually check the public keys in the key manager.


## How to Contribute?

* Write Code, generate Documentation, check Crypto Concepts
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject


## Developers
* We use Sublime Text 3 with https://github.com/jdc0589/JsFormat plugin to write code.


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






</table>

