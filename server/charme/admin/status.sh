#!/bin/bash
. ./variables.sh

RCol='\e[0m'    # Text Reset


#
#Section: Color Definitions
#

# Regular           Bold                Underline           High Intensity      BoldHigh Intens     Background          High Intensity Backgrounds
Bla='\e[0;30m';     BBla='\e[1;30m';    UBla='\e[4;30m';    IBla='\e[0;90m';    BIBla='\e[1;90m';   On_Bla='\e[40m';    On_IBla='\e[0;100m';
Red='\e[0;31m';     BRed='\e[1;31m';    URed='\e[4;31m';    IRed='\e[0;91m';    BIRed='\e[1;91m';   On_Red='\e[41m';    On_IRed='\e[0;101m';
Gre='\e[0;32m';     BGre='\e[1;32m';    UGre='\e[4;32m';    IGre='\e[0;92m';    BIGre='\e[1;92m';   On_Gre='\e[42m';    On_IGre='\e[0;102m';
Yel='\e[0;33m';     BYel='\e[1;33m';    UYel='\e[4;33m';    IYel='\e[0;93m';    BIYel='\e[1;93m';   On_Yel='\e[43m';    On_IYel='\e[0;103m';
Blu='\e[0;34m';     BBlu='\e[1;34m';    UBlu='\e[4;34m';    IBlu='\e[0;94m';    BIBlu='\e[1;94m';   On_Blu='\e[44m';    On_IBlu='\e[0;104m';
Pur='\e[0;35m';     BPur='\e[1;35m';    UPur='\e[4;35m';    IPur='\e[0;95m';    BIPur='\e[1;95m';   On_Pur='\e[45m';    On_IPur='\e[0;105m';
Cya='\e[0;36m';     BCya='\e[1;36m';    UCya='\e[4;36m';    ICya='\e[0;96m';    BICya='\e[1;96m';   On_Cya='\e[46m';    On_ICya='\e[0;106m';
Whi='\e[0;37m';     BWhi='\e[1;37m';    UWhi='\e[4;37m';    IWhi='\e[0;97m';    BIWhi='\e[1;97m';   On_Whi='\e[47m';    On_IWhi='\e[0;107m';


#
#Section: Disclaimer
#

echo -e ""
echo -e ""
echo -e "-------------------------------------------------------------------------------"
echo -e "${BWhi}This is Charme Status Version 0.1 $RCol"
echo -e "Copyright (c) 2015 Manuel Schultheiss\n"
echo -e "License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law."
echo -e "-------------------------------------------------------------------------------"

#
#Section: Function Definitions
#


checkRunning(){ # 1st arg is title, second arg process name
if ps aux | grep -v grep | grep $2 > /dev/null
then
  echo -e "$1\t\t ${Gre}Active and Running$RCol"
else
  echo -e "$1\t\t ${BRed}Not running$RCol"
fi
}

checkPHPExtension(){ # 1st arg is title, second arg process name


cat ${CLIPHPPATH} | grep extension=$2 > /dev/null
if [ $? -eq 0 ]; then
  echo -e "$1\t\t ${Gre}Enabled$RCol"
else
  echo -e "$1\t\t ${BRed}Disabled$RCol"
fi
}

#
#Section: Check Config File
#

echo -e ""
echo -e "$UWhi""Config File: $RCol"
[ -f "../config.php" ] && echo -e "config.php \t\t ${Gre}Found$RCol" || "config.php \t\t ${BRed}Not found$RCol"
echo -e ""
echo -e "$UWhi""Running  Processes: $RCol"
checkRunning "Gearman   " gearmand


# apache is called http on fedora, apache2 on debian
ps cax | grep httpd > /dev/null
	if [ $? -eq 0 ]; then
checkRunning "Apache2   " httpd
	else
checkRunning "Apache2   " apache2
	fi
checkRunning "MongoDB   " mongod
echo -e ""

#
#Section: Check PHP Extension
#

if [ -f "${CLIPHPPATH}" ]; then
  echo -e "$UWhi""Loaded PHP Extensions in ${CLIPHPPATH}: $RCol"
  checkPHPExtension "MongoDB   " "mongo.so"
  checkPHPExtension "Gearman   " "gearman.so"
  checkPHPExtension "ZeroMQ   " "zmq.so"
else
  echo -e "${BYel}Warning: php.ini not found in ${CLIPHPPATH}.\n${Yel}If it exists somewhere, please edit the CLIPHPPATH variable in variables.sh.  $RCol"
fi


echo -e ""

echo -e "$UWhi""Running Background Tasks: $RCol"
checkRunning bg_hydra.php "bg_hydra.php"
checkRunning bg_events.php "bg_events.php"
echo -e "${BBlu}Hint:${RCol} Run startbg.sh if some background tasks are not running."
echo -e ""

if [ ! -f ../config/imprint.html ]; then
    echo -e "${BRed}WARNING: $RCol config/imprint.html not found. You should provide an imprint as a server host."
fi

if [ ! -f ../config.php ]; then
    echo -e "${BRed}ERROR: $RCol config.php not found."
fi

#
#Section: Footer
#

echo -e "-------------------------------------------------------------------------------"

echo -e "If there are errors, make sure all components are installed properly!"

echo -e "-------------------------------------------------------------------------------"
echo -e "Please see doc/faq_errors.md in the GIT repo to fix any problems marked red above\nAlso make sure you check the apache logs for errors. \nUsually the log is saved in /var/log/apache2/error.log"
echo -e "If gearman is not running run 'gearmand -d'"
echo -e ""
