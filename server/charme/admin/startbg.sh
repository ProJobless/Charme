#!/bin/bash

# This script starts background processes for Charme

. ./variables.sh # include variables



echo "Note: Make sure you are in superuser mode..."
#su

if ps aux | grep -v grep | grep "gearmand" > /dev/null
then
	echo -e  "Gearman is already running"
else
	echo -e  "Starting Gearman..."
	service gearmand start&

fi

echo -e  "Waiting some seconds..."
sleep 1

if ps aux | grep -v grep | grep "httpd" > /dev/null
then
	echo -e  "httpd is already running"
else
	echo -e  "Starting httpd..."
	service httpd start
fi

echo -e  "Waiting some seconds..."
sleep 1

if ps aux | grep -v grep | grep "mongo" > /dev/null
then
	echo -e  "mongo is already running"
else
	echo -e  "Starting mongo..."
	nohup mongod & 
fi

echo -e  "Waiting some seconds..."
sleep 1

service httpd restart 

echo -e  "Waiting some seconds..."
sleep 1

echo -e "Starting background processes with php.ini in ${CLIPHPPATH}... "

if ps aux | grep -v grep | grep "bg_hydra.php" > /dev/null
then
	echo -e  "Hydra is already running"
else
	echo -e  "Starting hydra..."
	nohup php ../bg_hydra.php --php-ini ${CLIPHPPATH}  & 
fi


if ps aux | grep -v grep | grep "bg_events.php" > /dev/null
then
	echo -e "Socket Server is already running"
else
	echo -e  "Starting Socket Server..."
	nohup php ../bg_events.php --php-ini ${CLIPHPPATH} &
fi

echo -e  "Restarting Apache Server now..."
service httpd restart

sleep 1
echo -e  "Starting Charme Status now..."

./status.sh
