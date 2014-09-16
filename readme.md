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

## Setup a client
  * Just copy the files in `/jsclient` on your server

## Setup a server

```
apt-get install gearman
apt-get install gearman-job-server libgearman-dev
pecl install gearman-1.0.3

```


  * Make sure PHP5 and apache2 is installed on your machine
  * Install pecl if not done yet
    ```
    apt-get install php5-dev
    apt-get install make
    apt-get install php-pear
    apt-get install php5-curl
    ```
  * Install mongoDB via `pecl install mongo` and
    ```
    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
    apt-get update
    apt-get install -y mongodb-org
    apt-get install php5-gd
    ```

  * Install Gearman via


  * Add gearman and mongodb to php.ini via:

    `nano /path/to/php.ini` To find the path run phpinfo(). Then add the lines
    ```
    extension=mongo.so
    extension=curl.so
    extension = gearman.so
    ```
    Also make sure `short_open_tag` is set to true in php.ini

   * Copy the files in `/server/charme` to `yourserver.com/charme`, so that req.php is acessable via `yourserver.com/charme/req.php`
   * Protect yourserver.com/charme/admin with a .htaccess file in production use!
   * Start gearman server via `php hydra.php` in `yourserver.com/charme` directory

   * Restart apache via `service apache2 restart`


###Appendix: Compiling PHP with PThreads

After downloading the PHP sources, goto /src/php[VERSION]/ext dictionary and add pthreads:
```
git clone https://github.com/krakjoe/pthreads.git
```

Make sure Apache Headers (apxs2) exist to generate libphp5.so: 

```
sudo apt-get install apache2-threaded-dev
```
Make sure Curl Headers are available (libcurl4-dev) by installaing a package containing them:
```
sudo apt-get install libcurl4-gnutls-dev
```


Then recompile PHP
```
cd .. # Goto php source dir
rm configure
./buildconf --force
# --with-[png|jpeg]-dir= may vary here:
./configure --enable-debug --enable-maintainer-zts --with-apxs2=/usr/bin/apxs2 --enable-pthreads --with-curl --with-gd --with-png-dir=/usr/lib --with-jpeg-dir=/usr/lib/x86_64-linux-gnu/libjpeg.so

make clean
make
make install
libtool --finish /src/php-5.5.12/libs #The pass is given you by make install
cd libs
cp libphp5.so /usr/lib/apache2/modules/libphp5.so #second parameter can be found out via locate libphp5.so if upgrading to a newer version

```

For more details, read:
http://www.php.net/manual/en/install.unix.apache2.php
Do not forget to edit  httpd.conf to load the right php5 module.
Edit httpd.conf to load the so module:
```
LoadModule php5_module  /usr/lib/apache2/modules/libphp5.so
```

### Install FAQ
 * Can not load *.so File? Maybe the destination is wrong. Use `locate file.so` and  cp to Change pass, for example: `cp /usr/lib/php5/20100525/curl.so /usr/local/lib/php/extensions/debug-zts-20121212/curl.so`

## Install a client
 * copy the files in the /client directory onto a (local) webserver and access via index.html
 * Please note that Firefox currently has some problems with the textbox for writing messages. Everything shoudl work fine in Chromium/Chrome however.

## Crypto

* We use a RSA/AES cryptosystem to encrypt messages and private data
* The private key is stored on a server, encrypted with a 20 digit passphrase.
* To validate public keys we will implement a Web-Of-Trust like key verification system, that checks if some/all friends of a user own the same public key of him in the background. You currently have to validate the public keys in the key manager in the client via Settings/Key Manager.

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

