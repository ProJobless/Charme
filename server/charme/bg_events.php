<?php
namespace MyApp;
/*
	TODO: ONLY ALLOW USERS TO SUBSCRIBE TO THEIR OWN MESSAGES!!!
    TODO: Return information to localhost  if a user is connected or not when calling on new message.
          If a user is not connected then increment talks counter
*/
require 'vendor/autoload.php';
// Start this one via `php events.php`
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;
// http://stackoverflow.com/questions/21457280/autobahn-js-how-to-pass-data-on-subscribe
class Pusher implements WampServerInterface {


    protected $theUserIds = array();

    public function onSubscribe(ConnectionInterface $conn, $topic) {

        print("USER ID IS".$topic->getId());
        $this->theUserIds[$topic->getId()] = $topic; 
    }

    public function onNewMessage($message) {
        $entryData = json_decode($message, true);
        echo "SENT IT OUT!!";
        if (!array_key_exists($entryData['owner'], $this->theUserIds))
            return;
        else
        {

         $topic = $this->theUserIds[$entryData["owner"]];
        // re-send the data to all the clients subscribed to that category
      // if ($entryData["owner"] != $this->theUserId)
         $topic->broadcast($entryData);
 
        }
    }
  
    public function onUnSubscribe(ConnectionInterface $conn, $topic) {
    }
    
    public function onOpen(ConnectionInterface $conn) {
         echo "onpen ";
    }
    
    public function onClose(ConnectionInterface $conn) {
    }
    
    public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }
    
    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {
        // In this application if clients send data it's because the user hacked around in console
        $conn->close();
    }
    
    public function onError(ConnectionInterface $conn, \Exception $e) {
    }
}

    $loop   = \React\EventLoop\Factory::create();
    $pusher = new Pusher;

  	// Listen for the web server to make a ZeroMQ push after an ajax request
    $context = new \React\ZMQ\Context($loop);
    $pull = $context->getSocket(\ZMQ::SOCKET_PULL);
    $pull->bind('tcp://127.0.0.1:5555'); // Binding to 127.0.0.1 means the only client that can connect is itself
    $pull->on('message', array($pusher, 'onNewMessage'));

    // Set up our WebSocket server for clients wanting real-time updates
    $webSock = new \React\Socket\Server($loop);
    $webSock->listen(8085, '0.0.0.0'); // Binding to 0.0.0.0 means remotes can connect
    $webServer = new \Ratchet\Server\IoServer(
        new \Ratchet\Http\HttpServer(
            new \Ratchet\WebSocket\WsServer(
                new \Ratchet\Wamp\WampServer(
                    $pusher
                )
            )
        ),
        $webSock
    );

    $loop->run();