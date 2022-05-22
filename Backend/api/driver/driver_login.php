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


$email = $data['email'];
$password = md5($data['password']);


if(!empty($email) && !empty($password)){
	$sql = "Select * from app_ambulance_drivers where demail = '$email' AND dpassword = '$password'";
	$result = mysqli_query($con,$sql);
	if(mysqli_num_rows($result))
	{
	  $row = mysqli_fetch_assoc($result);
	  $token = md5(uniqid(rand(), true));
	  $did = $row['aadid'];
	  $sql = "REPLACE INTO auth_ambulance_driver(did, token) values($did, '$token')";
	  if($res = mysqli_query($con,$sql)){
	  	header('Content-Type: application/json');
	  	$row['token'] = $token;
	    echo json_encode(array('status' => true,'status_code' => 200,'user' => $row));
	  }else{
	  	 header('Content-Type: application/json');
	     echo json_encode(array('status' => false,'status_code' => 400,'message' => 'Server Error!'));
	  }

	}
	else
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => false,'status_code' => 400,'message' => 'User does not exists.'));
	}
}
mysqli_close($con);
?>