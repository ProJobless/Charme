cd charmesocial
if [ -d /home/ms/Android/Sdk ]
  then
  echo "Exporting Environment Variables..."
  export ANDROID_HOME="/home/ms/Android/Sdk/"
  export ANDROID_TOOLS="/home/ms/Android/Sdk/tools"
  export ANDROID_PLATFORM_TOOLS="/home/ms/Android/Sdk/platform-tools"

  echo "Copying Charme Folder..."
  cp ../wwwTemp ./www
  cp ../jsclient ./www



  PATH=$PATH:$ANDROID_HOME:$ANDROID_TOOLS:$ANDROID_PLATFORM_TOOLS
  cordova build

  read -r -p "Do you want to start the Android emulator? (y/n)" response
  if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
  then
      cordova run android
  else
      echo "Done"
  fi
else #if needed #also: elif [new condition]
  echo "NOTICE: Please set up your Android path corretly in this .sh file!!!"
fi
cd ..
