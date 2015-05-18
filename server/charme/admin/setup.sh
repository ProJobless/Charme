#!/bin/bash
echo "Not working yet..."

. ./variables.sh # include variables
. ./functions.sh # include functions


command_exists () {
    type "$1" &> /dev/null ;
}



step2() {
	echo "Installing PHP....."

	if [[ ! -z $YUM_CMD ]]; then
		yum install php php-cli php-pear httpd
		yum install php-devel
		yum install php-gd
		
	elif [[ ! -z $APT_GET_CMD ]]; then
		apt-get install apache2
		apt-get install php5-dev
		apt-get install make
		apt-get install php-pear
		apt-get install php5-curl
		apt-get install php5-gd
		apt-get install gearman
		apt-get install gearman-job-server libgearman-dev
		pecl install gearman-1.0.3
		apt-get install libzmq-dev
		pecl install zmq-beta

	fi



	echo "Installing MongoDB"
	echo "Please follow the instructions on\n http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/ \n"

	read -r -p "Type y if you have installed mongoDB? [y]  " response
	read -r -p "Are you sure? [y/N] " response
	if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
	then
	    step3
	else
	    echo "Installation cancelled...."
	fi
}

step3() {
	if command_exists mongo ; then
		echo "MongoDB was found!"
	else
	    echo "FATAL ERROR: MongoDB not found. Please follow instructions to install on\nhttp://docs.mongodb.org/manual/installation/"
	#pecl install mongo
	step4
	fi
}

step4() {
	echo "TODO"

}
stepLast() {
	echo -e "---------------------------"
	echo -e "Restarting Apache Server"
	service httpd restart
	sleep 1
	echo -e "---------------------------"

	echo -e "Installation finished. Please add the following lines to your php.ini:"
	echo -e "extension=mongo.so"
	echo -e "extension=curl.so"
	echo -e "extension=gearman.so"
	echo -e "extension=zmq.so"

}

step1(){
	read -r -p "Please make sure mongoDB is installed before and you are in superuser mode.\nWe are going to install a lot of packages now...\n Do you want to install Charme? [y/N]  " response
	if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
	then
	    echo "Installing Charme...."
	    step2
	else
	    echo "Installation cancelled...."
	fi
}



if [[ ! -z $YUM_CMD ]]; then
	echo -e "Detected Package Manager is yum...\nProceeding to install..."
	step3
elif [[ ! -z $APT_GET_CMD ]]; then
	echo -e "Detected Package Manager is apt-get\n...Proceeding to install..."
	step3
else
echo "error can't install package $PACKAGE"
exit 1;
fi
