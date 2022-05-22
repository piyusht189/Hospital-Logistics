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
$noti_token = $data['fcmtoken'];


if(!empty($email) && !empty($password) && !empty($noti_token)){
	$sql = "Select uid,hid,uname,uphone,uemail,u_role from user where uemail = '$email' AND upassword = '$password'";
	$sql1 = "Update user set noti_token='$noti_token' where uemail = '$email' AND upassword = '$password'";
    $result = mysqli_query($con,$sql);
	if(mysqli_num_rows($result))
	{
	  mysqli_query($con,$sql1);
	  $row = mysqli_fetch_assoc($result);
	  $token = md5(uniqid(rand(), true));
	  $uid = $row['uid'];
	  $sql = "REPLACE INTO auth_hospital(uid, token) values($uid, '$token')";
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