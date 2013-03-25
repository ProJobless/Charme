# Charme


Charme is a distributed and open source social network. In contrast to classic social networks you can save your user data on your own server or a server of your choice. The project is splitted into the following sub projects:

<table>
    <tr>
        <td>Path</td>
        <td>Description</td>

    </tr>

    <tr>
        <td>/web (deprecated)</td>
        <td>Files of the old version.</td>

    </tr>

        <tr>
        <td>/android</td>
        <td>Android App Files</td>

    </tr>

     <tr>
        <td>/demo</td>
        <td>Various screenshots and promotion images.</td>

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

## Installation

  * Install PHP
  * Make sure short_open_tag is set to true in php.ini, otherwise 
    PHP will not parse php files. 
  *  Make sure curl is enabled in php.ini
  * Install MongoDB, see http://www.php.net/manual/de/mongo.installation.php
  *  Copy the files on your webserver so that index.php is in the root directory. Note: If you copied the repository, just copy the files in the /server directory on your server.
  * Protect /admin with a .htaccess file
  * Edit config.php. Set a network ID. To be compa
  * tible to other beta testers set NETWORK_ID to CHARME_BETA1. You have to read and agree to license_charme.txt when joining networks starting with CHARME.

## Version

Warning: This version is for preview puposes only. This version is NOT stable and misses essential functions like form validation.
We plan to release a stable version by summer 2014.


