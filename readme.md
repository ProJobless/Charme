![Screenshot](https://raw.githubusercontent.com/mschultheiss/Charme/master/demo/screen2.png "Screenshot")




*﻿Charme* is a distributed and open source social network. In contrast to current social networks you can save your user data on your own server or a server of your choice. Furthermore messages, private posts and private profile information are end-to-end encrypted.

Moreover you can add semantic information to your posts. With this feature it is possible to perform search queries like "Show me all events created by my fellow students in a 30 km radius" or "Show me all friends driving from Munich to Augsburg tommorrow":

![Screenshot](https://raw.githubusercontent.com/mschultheiss/Charme/master/tex/illustrations/context.jpg "Screenshot")

![Screenshot](https://raw.githubusercontent.com/mschultheiss/Charme/master/demo/screen3.png "Screenshot")

For smartphones, the client can be exported as an Apache Cordova project.

**Warning:** This is for preview puposes only. This preview version is neither stable nor secure. It is in development.


Directories:

<table>
  <tr>
  <td>**Path**</td>
  <td>**Description**</td>
  </tr>
  <tr>
    <td>/jsclient</td>
    <td>Web based Client doing encryption and client-to-server requests.</td>
  </tr>
  <tr>
    <td>/server</td>
    <td>This directory contains all the code for running a server.</td>
  </tr>
  <tr>
    <td>/doc</td>
    <td>Developer Documentation. See the Github Wiki also</td>
  </tr>
  <tr>
    <td>/Mobile</td>
    <td>Mobile App Files. Incomplete.</td>
  </tr>
</table>



## How to Contribute?

* Help testing or write code! You can also write code for stand alone components while having zero knowledge about the system architecture itself!
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject


## Setup a client
  * Just copy the files in `/jsclient` on your server

## Setup a Server
 * Copy the files in `/server/charme` to `yourserver.com/charme`, so that req.php is acessable via `yourserver.com/charme/req.php`
 Afterwards use the server/charme/admin/setup.sh script on Debian and Fedora. If you are using another OS or there are some errors, try out the steps described in the `install.md` file.

 * The most common errrs are listed in <a href="/faq_errors.md">faq_errors.md</a>.

## Libraries
 A lot of libraries are used in Charme. Find a list <a href="/libraries.md">here</a>.


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
