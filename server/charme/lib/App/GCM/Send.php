<?php
/**
* Google Cloud Messageing Class -> Allows PUSH Notifications for Android Devices.
*/

namespace App\GCM;

// Usage: $col = new \App\DB\Get();
class Send
{

	public static function NotifyNew($registrationIDs, $payload)
	{
		if (Count($registrationIDs) < 1) // 
			return 0;


			global $CHARME_SETTINGS;			// Replace with real GCM browser / server API key from Google APIs
			$apiKey = $CHARME_SETTINGS["GCM_APIKEY"];
			// Replace with real client registration IDs, most likely stored in your database
					
			// Get ids in GCM Collection containing receiver list.
			

		
			// Payload data to be sent
			$data = array( 'message' => $payload);
			// Set request URL to GCM endpoint
			$url = 'https://android.googleapis.com/gcm/send';
			// Set POST variables (device IDs and payload)
			$fields = array(
			                'registration_ids'  => $registrationIDs,
			                'data'              => $data,
			                );
			// Set request headers (authentication and payload type)
			$headers = array( 
			                    'Authorization: key=' . $apiKey,
			                    'Content-Type: application/json'
			                );
			// Open connection
			$ch = curl_init();

			// Set the url
			curl_setopt( $ch, CURLOPT_URL, $url );
			// Set request method to POST
			curl_setopt( $ch, CURLOPT_POST, true );
			// Set custom headers
			curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
			// Get response back as string
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
			// Set post data
			curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );

			curl_setopt($ch, CURLOPT_USERAGENT, "curl");
   			
			// MAKE ASYNC:
   			// curl_setopt($ch, CURLOPT_TIMEOUT, 1); 


			//curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
			//curl_setopt($ch, CURLOPT_TIMEOUT_MS, 1);






			// Send the request
			$result = curl_exec($ch);

			// Close connection
			curl_close($ch);
			// Debug GCM response
	
			if ($CHARME_SETTINGS["DEBUG"])
			return $result;

	} 


}
?>
