#!/bin/bash
echo "Not working yet..."



command_exists () {
    type "$1" &> /dev/null ;
}



step2() {
	echo "Installing PHP....."
	yum install php php-cli php-pear httpd
	yum install php-devel

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
	echo "lalal"
	if command_exists mongo ; then
		echo "Mongo DB FOUND!"
	else
	    echo "FATAL ERROR: MongoDB not found. Please follow instructions to install on\nhttp://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/"
	#pecl install mongo
	step4
	fi
}

step4() {
	echo "TODO"

}
stepLast() {
	service httpd restart
}

step1(){
	read -r -p "Please make sure mongoDB is installed before.\n Do you want to install Charme? [y/N]  " response
	if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
	then
	    echo "Installing Charme...."
	    step2
	else
	    echo "Installation cancelled...."
	fi
}


step3