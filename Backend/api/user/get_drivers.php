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

	$sql = "Select aadid,hid,dname,demail,ddob,dphone from app_ambulance_drivers where hid = $hid";
	$result = mysqli_query($con,$sql);
	if(mysqli_num_rows($result) > 0){
		$drivers = array();
		while($row = mysqli_fetch_assoc($result)){
			$drivers[] = $row;
		}
	    header('Content-Type: application/json');
	    echo json_encode(array('status' => true,'status_code' => 200,'drivers' => $drivers));
	}
	else
	{
	 header('Content-Type: application/json');
	  echo json_encode(array('status' => true,'status_code' => 200,'drivers' => array()));
	}
}
mysqli_close($con);
?>