# Charme

Charme is a distributed and open source social network. In contrast to current social networks you can save your user data on your own server or a server of your choice. Furthermore messages and private information requests are end-to-end encrypted. 

**Warning: This is for preview puposes only. This version is NOT stable and NOT secure yet.**

Directories:



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
        <td>Server for Encrypted Communication. You only need this folder when you install a server.</td>

    </tr>


    
</table>

## Screenshot

![Screenshot](https://raw.github.com/mschultheiss/charme/dev/demo/screen2.png "Screenshot")

## How to Contribute?

* Help testing or write code! You can also write code with having zero knowledge about the system architecture!
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject


## Setup a client
  * Just copy the files in `/jsclient` on your server

## Setup a Server
 * Copy the files in `/server/charme` to `yourserver.com/charme`, so that req.php is acessable via `yourserver.com/charme/req.php`
 Afterwards use the server/charme/admin/setup.sh script on Debian and Fedora. If you are using another OS or there are some errors, try out the steps described in the `install.md` file.

## Error FAQ

###Unable to connect to mongoDB
One reason may be that apache has not loaded mongodb. Try

`service httpd restart` on Fedora or `service apache2 restart` on Debian

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
When getting a `GearmanException` with message `Failed to set exception option` then make sure gearmand is running. To check use `ps aux | grep gearmand`.

## Install a client
 * copy the files in the /client directory onto a (local) webserver and access via index.html
 * Please note that Firefox currently has some problems with the textbox for writing messages. Everything should work fine in Chromium/Chrome however.


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

