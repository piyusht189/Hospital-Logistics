<?php
require __DIR__.'/../database.php';

define( 'API_ACCESS_KEY', 'AAAAzh9rKHw:APA91bGtHllf4gUkcCmAJqiwvcQgBhrkApY6mrp8MlmaepIeYhPNCvwzkXxsb3YRuyrualGUtzi7XM9mzGJqPXb-Nnx1xLiY6IGRWWh4TeV6kMUHnm_ZhC6u3vFHBNvbqRh--bS4COHd' );

$json = file_get_contents('php://input');

$data = json_decode($json, true);


$did = $data['did'];
$worklog = $data['worklog'];
$current_date_time = gmdate('Y-m-d H:i:s');
$mobile = $data['mobile'];



if(!empty($did) && !empty($worklog) && !empty($current_date_time)){
	$sql = "Insert into tasks_ambulance(aadid,work_log,assigned_time) values($did, '$worklog', '$current_date_time')";

	if($result = mysqli_query($con,$sql))
	{
		

	   header('Content-Type: application/json');
	   echo json_encode(array('status_code' => 200,'message' => 'Task Added and Assigned Successfully'));

	   $json_log = json_decode($worklog, true);
	   $title  = 'New Drive Added';

	        $sql = "select hid,dname,demail from app_ambulance_drivers where aadid=$did";
			$result = mysqli_query($con, $sql);
			$row = mysqli_fetch_assoc($result);
			$name = $row['dname'];
			$email  = $row['demail'];
			$hid  = $row['hid'];
			$sql = "select noti_token from user where hid=$hid";
			$result = mysqli_query($con, $sql);
			$row = mysqli_fetch_assoc($result);
			$noti_token = $row['noti_token'];
	        $title1 = 'Drive Added by independent driver '.$name.'('.$email.') just now!';


	   $body = $json_log['0']['message'].'->'.$json_log['1']['message'].'...';
	   $sql = "Insert into driver_notifications(did, title, body, sent_at) values($did, '$title', '$body','$current_date_time')";
	   mysqli_query($con, $sql);

	   if(!empty($mobile)){
	   	// Sending Noti to Hospital
			$msg = array
			(
			    'body'  => $body,
			    'title'     => $title1,
			    'vibrate'   => 1,
			    'sound'     => 1,
			);

			$fields = array
			(
			   // 'to'  => $noti_token,
			    'registration_ids'  => [$noti_token],
			    'priority' => 'high',
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
		}
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
		
	}
	else
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 400,'message' => 'Something went wrong.'));
	}
}
 
mysqli_close($con);

?>