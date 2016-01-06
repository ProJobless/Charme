#!/bin/bash
echo "Not working yet..."

. ./variables.sh # include variables
. ./functions.sh # include functions

command_exists () {
    type "$1" &> /dev/null ;
}

step2() {
	echo "Installing PHP....."

	if [[ ! -z $YUM_CMD ]]; then # Is it  Fedora?
		yum install php php-cli php-pear httpd
		yum install php-devel
		yum install php-gd

	elif [[ ! -z $APT_GET_CMD ]]; then # or is it Debian?
		apt-get install -y apache2 libapache2-mod-php5 php5-dev make php-pear php5-curl php5-gd gearman gearman-job-server libgearman-dev
		pecl install gearman-1.0.3
		apt-get install -y mongodb libzmq-dev
		pecl install zmq-beta
		apt-get install  -y pkg-config

	fi

  if [[ ! -z $YUM_CMD ]]; then
	echo -e "Please follow the instructions on\n http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/ \n"
  elif [[ ! -z $APT_GET_CMD ]]; then
  echo -e "Please follow the instructions on http://docs.mongodb.org/ to install mongoDB on Debian."
  fi

	if [[ ! -z $YUM_CMD ]]; then
    dnf install mongodb mongodb-server
    /usr/sbin/setsebool -P httpd_can_network_connect 1 # needed to avoid mongodb permission errors from php webpage
		read -r -p "Type y if you have installed mongoDB? [y]  " response
		if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
		then
		    step3
		else
		    echo "Installation cancelled...."
		fi
	elif [[ ! -z $APT_GET_CMD ]]; then
		step3
	fi
}

step3() {
	if command_exists mongo ; then
		echo "MongoDB was found!"
    step4
	else
	    echo "FATAL ERROR: MongoDB not found. Please follow instructions to install on\nhttp://docs.mongodb.org/manual/installation/"

	step4
	fi
}

step4() {

  echo -e "We install MongoDB driver for PHP, Gearman and ZeroMQ now...."


  if [[ ! -z $YUM_CMD ]]; then

  yum install gcc
  yum install zeromq-devel
  yum install libgearman-devel
  yum install gearmand
  pecl install gearman
  pecl install zmq-beta
  dnf install openssl-devel # needed for php mongodb driver
  pecl install mongo

  elif [[ ! -z $APT_GET_CMD ]]; then
  apt-get install gcc
  apt-get install gearman
  apt-get install gearman-job-server libgearman-dev
  pecl install gearman-1.0.3
  apt-get install libzmq-dev
  pecl install zmq-beta

  pecl install mongo
  fi

  stepLast
}

stepLast() {
	echo -e "---------------------------"
	echo -e "Restarting Apache Server"

	  if [[ ! -z $YUM_CMD ]]; then
		service httpd restart
	  elif [[ ! -z $APT_GET_CMD ]]; then
		service apache2 restart
	  fi

	sleep 1
	echo -e "---------------------------"

	echo -e "Installation nearly finished. Please add the following lines to your php.ini (CLI and APACHE!!!) now:"
	echo -e "extension=mongo.so"
	echo -e "extension=curl.so"
	echo -e "extension=gearman.so"
	echo -e "extension=zmq.so"
  echo -e "\n\nAlso make sure /charme/admin is protected with a .htaccess file properly."

  # For testing, developers can setup the vhosts like:
  #
  #  sudo gedit /etc/httpd/conf/httpd.conf
  #  <VirtualHost charme.local:80>
  #     ServerAdmin webmaster@example.com
  #     DocumentRoot /www/Charme/server
  #     ServerName charme.local:80
  # </VirtualHost>
  #
  # <VirtualHost client.local:80>
  #     ServerAdmin webmaster@example.com
  #     DocumentRoot /www/Charme/jsclient
  #     ServerName client.local:80
  # </VirtualHost>

  if [[ ! -z $YUM_CMD ]]; then
     echo -e "On Fedora your php.ini is usually located in /etc/php.ini"
  fi

  echo -e "\n\n\ If your done then restart your apache or httpd server!"

}

step1(){

if [ "$EUID" -ne 0 ]
  then   echo -e "ERROR: Please run in superuser mode\n "
  exit
else
   step1b
fi

}

step1b() {
	read -r -p "Do you want to install Charme? [y/N]  " response
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
	step1 # TODO: must be step 1 in the final version!
elif [[ ! -z $APT_GET_CMD ]]; then
	echo -e "Detected Package Manager is apt-get\n...Proceeding to install..."
	step1
else
echo "FATAL ERROR: We did not find a package manager like apt or yum."
exit 1;
fi
