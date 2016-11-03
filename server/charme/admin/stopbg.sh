service httpd stop
service gearmand stop
killall mongod
pkill -f "bg_events.php"
pkill -f "bg_hydra.php"
echo -e  "Waiting some seconds..."
sleep 1
killall gearmand
echo -e  "Starting Charme Status now..."
sleep 1
./status.sh