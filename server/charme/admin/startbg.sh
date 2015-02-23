#!/bin/bash

# This script starts background processes for Charme

. ./variables.sh # include variables

echo -e "Starting background processes with php.ini in ${CLIPHPPATH}... \n"

if ps aux | grep -v grep | grep "bg_hydra.php" > /dev/null
then
	echo -e  "Hydra is already running\n"
else
	echo -e  "Starting hydra...\n"
	nohup php --php-ini ${CLIPHPPATH} ../bg_hydra.php & 
fi


if ps aux | grep -v grep | grep "bg_events.php" > /dev/null
then
	echo -e "Socket Server is already running\n"
else
	echo -e  "Starting Socket Server...\n"
	nohup php ../bg_events.php --php-ini ${CLIPHPPATH} &
fi
