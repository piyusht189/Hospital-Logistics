<?php
require __DIR__.'/../database.php';


$json = file_get_contents('php://input');

$data = json_decode($json, true);


$hid = $data['hid'];


if(!empty($hid)){
	$sql = "Select title,body,sent_at from hospital_notifications as a where hid = $hid ORDER BY a.hnid Desc limit 10";
    if($result = mysqli_query($con,$sql))
	{
		$notis = array();
		while($row =  mysqli_fetch_assoc($result)){
			$notis[] = $row;
		}
		header('Content-Type: application/json');
		echo json_encode(array('status_code' => 200,'notifications' => $notis));

	}else{
		header('Content-Type: application/json');
		echo json_encode(array('status_code' => 400,'message' => 'No notifications found!'));
	}
}
mysqli_close($con);


?>