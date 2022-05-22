<?php
require __DIR__.'/../database.php';

define( 'API_ACCESS_KEY', 'AAAAzh9rKHw:APA91bGtHllf4gUkcCmAJqiwvcQgBhrkApY6mrp8MlmaepIeYhPNCvwzkXxsb3YRuyrualGUtzi7XM9mzGJqPXb-Nnx1xLiY6IGRWWh4TeV6kMUHnm_ZhC6u3vFHBNvbqRh--bS4COHd' );

$json = file_get_contents('php://input');

$data = json_decode($json, true);


$tid = $data['tid'];
$did = $data['did'];
$current_date_time = gmdate('Y-m-d H:i:s');

if(!empty($tid) && !empty($did)){
	$sql = "Delete from tasks_ambulance where atid = $tid";
	$result = mysqli_query($con,$sql);
	if($result){
		header('Content-Type: application/json');
	    echo json_encode(array('status_code' => 200,'message' => 'Drive has been discarded!'));

        $title  = 'One Drive Cancelled';
	    $body = 'Check drives log to know which drive got discarded.';
		$sql = "Insert into driver_notifications(did, title, body, sent_at) values($did, '$title', '$body','$current_date_time')";
		mysqli_query($con, $sql);
	    $msg = array
			(
			    'body'  => $body,
			    'title'     => $title,
			    'vibrate'   => 1,
			    'sound'     => 1,
			);

			$fields = array
			(
			    'to'  => '/topics/a'.$did,
			    'notification' => $msg
			);

			$headers = array
			(
			    'Authorization: key='.API_ACCESS_KEY,
			    'Content-Type: application/json'
			);

			$ch = curl_init();
			curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
			curl_setopt( $ch,CURLOPT_POST, true );
			curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
			curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
			$result = curl_exec($ch );
			curl_close( $ch );
	}else{
		header('Content-Type: application/json');
	    echo json_encode(array('status_code' => 400,'message' => 'Something went wrong!'));
	}
}
 
mysqli_close($con);

?>