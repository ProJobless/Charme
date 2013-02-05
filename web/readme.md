# Charme

## What is Charme

Charme is a distributed and open source social network. In contrast to classic social networks you can save your user data on your own server or a server of your choice.

## Version

Warning: This version is for preview only. This version is not stable and misses essential functions like encrpytion and privacy control.
We plan to release a stable version in 2014.

## Installation

  * Install PHP
  * Make sure short_open_tag is set to true in php.ini, otherwise 
    PHP will not parse php files. 
  *  Make sure curl is enabled in php.ini
  * Install MongoDB, see http://www.php.net/manual/de/mongo.installation.php
  *  Upload the files to your Server.
  *  Open "/install" and follow instructions

## License

Charme is basically MIT licensed, but you are not
allowed to remove the credit parts of the about page or the link to the about page.
See license.txt for more information.

All third party libraries have their own license.
You have to accept to their license or remove them.

## Questions?

See our website http://charmeproject.com
for more information.


## Libraries


<table>
    <tr>
        <td>Name</td>
        <td>License</td>
        <td>Filepath</td>
    </tr>

    <tr>
        <td>Rockmongo</td>
        <td>BSD</td>
        <td>/admin/rockmongo</td>
    </tr>
        <tr>
        <td>WideImage</td>
        <td>GNU LGPL 2.1.	</td>
        <td>/tparty/wideimage</td>
    </tr>
        <tr>
        <td>jQuery Terminal</td>
        <td>GNU LGPL</td>
        <td>/admin/terminal.js</td>
    </tr>
        <tr>
        <td>Mathjax</td>
        <td>Apache License</td>
        <td>/tparty/mathjax</td>
    </tr>
     <tr>
        <td>Latex to MathML Converter</td>
        <td>GPL</td>
        <td>/tparty/latex2ml</td>
    </tr>
           <tr>
        <td>jQuery</td>
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
</table>


The full license files can be found in the specified filepath.