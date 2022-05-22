<?php
require __DIR__.'/../database.php';


$json = file_get_contents('php://input');

$data = json_decode($json, true);

$aadid = $data['did'];


if(!empty($aadid)){
	
	$sql = "Select current_status from app_ambulance_drivers where aadid = $aadid";
	$result = mysqli_query($con,$sql);
    if(mysqli_num_rows($result) > 0)
	{
	  $row = mysqli_fetch_assoc($result);
	  $status = $row['current_status'];
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 200,'status' => $status));
	}
	else
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 400,'message' => 'Something went wrong.'));
	}
}
	mysqli_close($con);
?>