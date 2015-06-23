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
