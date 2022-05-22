<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
require __DIR__.'/../database.php';


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Takes raw data from the request



$json = file_get_contents('php://input');

$data = json_decode($json, true);


$hid = $data['hid'];

if(!empty($hid)){
	$sql = "Select * from driver_vehicles where hid = $hid AND hired = 0";
	$result = mysqli_query($con,$sql);
	if($result)
	{
	  $vehicles = array();
	  while($row = mysqli_fetch_assoc($result)){
	  	$vehicles[] = $row;
	  }
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => true,'status_code' => 200,'vehicles' => $vehicles));

	}
	else
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => false,'status_code' => 400,'message' => 'Something went wrong!'));
	}
}
mysqli_close($con);
?>