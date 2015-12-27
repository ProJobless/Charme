#!/bin/bash

# This script starts background processes for Charme


if [ "$EUID" -ne 0 ]
  then   echo -e "ERROR: Please run in superuser mode\n "
  exit
fi


echo -e "\n"
echo -e "################################################################"
echo -e "Note: Make sure you are in superuser mode... Type 'su' to do so."
echo -e "################################################################"
echo -e "\nStarting Charme..."

sleep 1

. ./variables.sh # include variables
. ./functions.sh # include functions

service mongod start

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
	if [[ ! -z $YUM_CMD ]]; then
		service httpd start&
	elif [[ ! -z $APT_GET_CMD ]]; then
		service apache2 start&
	fi
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

if [[ ! -z $YUM_CMD ]]; then
	service httpd restart&
elif [[ ! -z $APT_GET_CMD ]]; then
	service apache2 restart&
fi

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

if [[ ! -z $YUM_CMD ]]; then
	service httpd restart
elif [[ ! -z $APT_GET_CMD ]]; then
	service apache2 restart
fi


sleep 1
echo -e  "Starting Charme Status now..."

./status.sh

echo -e "Please make sure to delete /charme/log.txt from time to time as this file may get big!"
