###Unable to connect to MongoDB

- One reason may be that apache has not loaded the mongodb module. Try

`service httpd restart` on Fedora or `service apache2 restart` on Debian
- Another reason can be a missing /data/db directory. Use mkdir to create One
- MongoDB needs ca. 3 GB diskspace for its journal, otherwise it will not start. You see this exception when typing mongod into the console

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
- When getting a `GearmanException` with message `Failed to set exception option` then make sure gearmand is running. To check use `ps aux | grep gearmand`.
- PHP Fatal error:  Class 'GearmanWorker' not found. Make sure `extension=gearman.so` is defined in your php.ini. Also note that you need to set it for the CLI and the Apache PHP module!!
