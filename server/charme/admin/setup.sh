#!/bin/bash
echo "Not working yet..."
break;; # not working yet
while true; do
    read -p "Do you want to install Charme? [y]es [n]o >" yn
    case $yn in
        [Yy]* ) 

		echo -e "Please enter (or paste via  CTRL+SHIFT+V) the path to your php.ini. This can be found out via phpinfo(). \nMake sure you use the CGI and not the CLI version of your php.ini:"


		break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done