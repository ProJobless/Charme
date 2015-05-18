## Setup a server
  Try to use the server/charme/admin/setup.sh script on Debian and Fedora. If you are using another OS or there are some errors, try out the following steps:


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