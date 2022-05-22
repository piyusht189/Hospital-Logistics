<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'Info@1234');
define('DB_NAME', 'gis_project');

function connect()
{
  $connect = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);

  if (mysqli_connect_errno($connect)) {
    die("Failed to connect:" . mysqli_connect_error());
  }

  mysqli_set_charset($connect, "utf8");

  return $connect;
}

$con = connect();

function isValid($con,$token){
        $flag = 0;
        $sql1 = "SELECT * FROM auth_ambulance_driver where token='$token'";
          $sql2 = "SELECT * FROM auth_regular_driver where token='$token'";
          $sql3 = "SELECT * FROM auth_hospital where token='$token'";
          $query1 = mysqli_query($con, $sql1);
          $query2 = mysqli_query($con, $sql2);
          $query3 = mysqli_query($con, $sql3);
          if(mysqli_num_rows($query1) || mysqli_num_rows($query2) || mysqli_num_rows($query3)){
            $flag = 1;
          }
          if($token == "login"){
            $flag = 1;
          }
          if($token == "logout"){
            $flag = 0; 
          }
    if($flag == 1){
      return true;
    }else{
    return false;
  }
}


$token = $_GET['token'];
$uid = $_GET["uid"];
$aadid = $_GET["aadid"];
$radid = $_GET["radid"];

if(!isValid($con,$token)){
  if(!empty($aadid)){
    // Ambulance Driver
    $sql1 = "Delete from auth_ambulance_driver where did = $aadid";
    $result1 = mysqli_query($con,$sql1);
  }
  if(!empty($radid)){
    // Regular Driver
     $sql2 = "Delete from auth_regular_driver where did = $radid";
     $result2 = mysqli_query($con,$sql2);
  }
  if(!empty($uid)){
    // Hospital
    $sql = "Update user set noti_token = Null where uid = $uid";
    $sql1 = "Delete from auth_hospital where uid = $uid";
    mysqli_query($con,$sql);
    mysqli_query($con,$sql1);
  }

  header('Content-Type: application/json');
  if($token == "logout"){
    echo json_encode(array('status_code' => 800,'message' => 'Logged Out Succesfully!'));
  }else{
    echo json_encode(array('status_code' => 800,'message' => 'Token Expired!'));
  }
  
  mysqli_close($con);
  exit();
}

?>