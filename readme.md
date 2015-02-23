# Charme

Charme is a distributed and open source social network. In contrast to current social networks you can save your user data on your own server or a server of your choice. Furthermore messages and private information requests are end-to-end encrypted. Client and server are two seperate projects to avoid the server from having access to decrypted information. Client-Server and server-server communication happens via JSON.

**Warning: This is for preview puposes only. This version is NOT stable and NOT secure yet. It will be released after it has been completed and peer reviewed. This will probably take some years.**

The project is splitted into the following sub projects, most important directories are:



<table>
    <tr>
        <td>Path</td>
        <td>Description</td>

    </tr>

   <tr>
        <td>/doc</td>
        <td>Developer Documentation. See the Github Wiki also</td>

    </tr>

        <tr>
        <td>/CharmeApp</td>
        <td>Android App Files</td>

    </tr>

      <tr>
        <td>/jsclient</td>
        <td>HTML5 based client for Encrypted Communication</td>

    </tr>

     <tr>
        <td>/server</td>
        <td>Server for Encrypted Communication</td>

    </tr>


    
</table>

## Screenshot

![Screenshot](https://raw.github.com/mschultheiss/charme/dev/demo/screen2.png "Screenshot")

## Setup a client
  * Just copy the files in `/jsclient` on your server

## Setup a server


  * Make sure PHP5 and apache2 is installed on your machine
  * Install pecl if not done yet
    ```
    apt-get install php5-dev
    apt-get install make
    apt-get install php-pear
    apt-get install php5-curl
    ```

    On Fedora install PECL with `yum install php` `yum install php-pear` and the PHP headers with `yum install php-devel`.

  * Install mongoDB
    ```
    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
    apt-get update
    apt-get install -y mongodb-org
    apt-get install php5-gd
    ```
    Then run `pecl install mongo`.
    If you use Fedora. see this page for instructions: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/

   
  * Install gearman and ZeroMq
    ```
    apt-get install gearman
    apt-get install gearman-job-server libgearman-dev
    pecl install gearman-1.0.3
    apt-get install libzmq-dev
    pecl install zmq-beta
    ```
    Note that you need to have installed a C compiler like gcc for pecl. For fedora use `yum install zeromq-devel`, `yum install libgearman-devel` and `yum install gearman` , and `pecl install gearman` instead of apt-get.

  * Add gearman and mongodb to php.ini via:

    `nano /path/to/php.ini` To find the path run phpinfo(). Then add the lines
    ```
    extension=mongo.so
    extension=curl.so
    extension = gearman.so
    extension=zmq.so
    ```
    Also make sure `short_open_tag` is set to true in php.ini

   * Copy the files in `/server/charme` to `yourserver.com/charme`, so that req.php is acessable via `yourserver.com/charme/req.php`
   * make sure `yourserver.com/charme/log.txt` is writeable
   * Restart apache via `service apache2 restart` (or `service httpd restart` on fedroa)
   * Start background services  in `yourserver.com/charme` directory via ./startbg.sh
   * Always check /var/log/apache2/error.log when something is not working and google the error message.
   * Protect yourserver.com/charme/admin with a .htaccess file in production use!
   * IMPORTANT: You can check the status of the installation by running the script in `/charme/admin/status.sh`. IF something is not working, look here first. This does work on Debian only however. Make sure the admin directory files are only executable by an admin. Also set the php.ini path of your PHP CGI installation (find out via phpinfo(), do not use php --ini) in variables.sh. 

## FAQ

###Unable to connect to mongoDB

```
service httpd restart
```
or 

```
service apache2 restart
```

### How to check loaded PHP modules

```
phpinfo();
```

### Fedora: MongoDB permission denied
```
/usr/sbin/setsebool -P httpd_can_network_connect 1 
service httpd restart
```
### Gearman
    * When getting a `GearmanException` with message `Failed to set exception option`: Make sure gearmand is running. To check use `ps aux | grep gearmand`!

## Install a client
 * copy the files in the /client directory onto a (local) webserver and access via index.html
 * Please note that Firefox currently has some problems with the textbox for writing messages. Everything should work fine in Chromium/Chrome however.

## How to Contribute?

* Write code, write documentation, check security
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject

## License
Charme is a distributed social network with end-to-end encryption

Copyright (C) 2015 Manuel Schultheiß

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


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
        <td>Leaflet</td>
        <td>Custom</td>
        <td>jsclient/vendor/leaflet</td>
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



 <tr>
        <td>AutobahnJS  Legacy (WAMP v1)</td>
        <td>MIT</td>
        <td>http://autobahn.ws/js/reference_wampv1.html</td>
    </tr>






</table>

