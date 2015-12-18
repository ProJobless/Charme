![Screenshot](https://raw.githubusercontent.com/mschultheiss/Charme/master/demo/vid.gif "Screenshot")

*﻿Charme* is a distributed and open source social network. In contrast to current social networks you can save your user data on your own server or a server of your choice (Just like [Diaspora](https://github.com/diaspora/diaspora)). Furthermore messages, private posts and private profile information are end-to-end encrypted.


- [Demo](http://mschultheiss.github.io/Charme/client/v1)  Do not provide any personal data as content is not served via https and the whole thing is not completely secure yet! Provide "mschultheiss.com" as a server when being asked at signup. Please note that data is reset periodically. Try to clear your cache if something is not working properly.




You can add semantic information to your posts. With this feature it is possible to perform search queries like "Show me all events created by my fellow students in a 30 km radius" or "Show me all friends driving from Munich to Augsburg tommorrow":

**Warning:** This is for preview puposes only. It is almost function complete but neither stable nor secure.
There are essential things missing, such as integrity protection for the client and forced https for server-to-server communication.
The code is of not-so-good quality right now and will be refactored and documented in the next months.
Things to do next:
- Improve Protocol
- Improve search
- Prevent Spam
- iOS App



## Setup a client
  * Just copy the files in `/jsclient` on your server to test. Later we will provide native builds for client installation.
  * An Android apk is available in

## Setup a Server
 * Copy the files in `/server/charme` to `yourserver.com/charme`, so that req.php is acessable via `yourserver.com/charme/req.php`
 Afterwards use the server/charme/admin/setup.sh script on Debian and Fedora. If you are using another OS or there are some errors, try out the steps described in the `install.md` file.

 * The most common errros are listed in <a href="/faq_errors.md">faq_errors.md</a>.


## FAQ

### Why am I not allowed to loose the passphrase
The passphrase basically encrypts all your private stuff. We can not provide a revert function here, because otherwise we could also read your private data, which is not what we want to.

### You have stolen the collection feature from Google Plus!
Wrong! Google introduced collections in May 2015 (https://plus.google.com/+googleplus/posts/7ZpGWeou2sV).
Charme had collections since 2012. Check out the commits from 2012/2013:
* https://github.com/mschultheiss/Charme/commit/a46d47bd4c59bf7fcae4c85992d271970d4e4f68
* https://github.com/mschultheiss/Charme/commit/eb8f2a7d8eb5534cb76db692dd489f78fd7a859d





## Developers
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



### How to Contribute?

* Help testing or write code! You can also write code for stand alone components while having zero knowledge about the system architecture itself!
* Getting started: https://github.com/mschultheiss/Charme/wiki/Getting%20Started
* Ask questions here: https://groups.google.com/forum/?hl=de&fromgroups#!forum/charmeproject




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
