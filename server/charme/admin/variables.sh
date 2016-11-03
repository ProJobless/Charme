#!/bin/bash
CLIPHPPATH='';

if [ -z "$CLIPHPPATH" ]; then # CLIPHPPATH is not defined (CLIPHPPATH="") -> check default path
ps cax | grep httpd > /dev/null
	if [ $? -eq 0 ]; then
		# if fedora then the php ini location changes
		CLIPHPPATH='/etc/php.ini';
	else
		CLIPHPPATH='/etc/php5/apache2/php.ini';
	fi
fi

echo $CLIPHPPATH
