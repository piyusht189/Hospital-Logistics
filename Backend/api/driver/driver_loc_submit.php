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


$did = $data['did'];
$latitude = $data['latitude'];
$longitude = $data['longitude'];


if(!empty($did) && !empty($latitude) && !empty($longitude)){

	$sql = "Select * from tracking where did = $did";
	$result = mysqli_query($con,$sql);
	$current_date_time = gmdate('Y-m-d H:i:s');
	if(mysqli_num_rows($result) == 0)
	{
	  $sql = "Insert into tracking(did,row,latitude,longitude,added_at) values($did,'new','$latitude','$longitude','$current_date_time')";
	  $result = mysqli_query($con,$sql);
	  if($result){
	    header('Content-Type: application/json');
	    echo json_encode(array('status' => true,'status_code' => 200));
	  }else{
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => false,'status_code' => 400));
	}
	}else if(mysqli_num_rows($result) == 1){
	  $row = mysqli_fetch_assoc($result);
	  $tid = $row['tid']; 
	  $sql = "Update tracking set row = 'old' where tid = $tid;";
      $sql .= "Insert into tracking(did,row,latitude,longitude,added_at) values($did,'new','$latitude','$longitude','$current_date_time')";
      $result = mysqli_multi_query($con,$sql);
      if($result){
	    header('Content-Type: application/json');
	    echo json_encode(array('status' => true,'status_code' => 200));
	  }else{
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => false,'status_code' => 401));
	}
	}else if(mysqli_num_rows($result) == 2){
		$row1 = mysqli_fetch_assoc($result);
		$row2 = mysqli_fetch_assoc($result);
		if($row1['row'] == 'new'){
			$tidnew = $row1['tid']; 
		    $tidold = $row2['tid']; 
		}else{
			$tidnew = $row2['tid']; 
		    $tidold = $row1['tid']; 
		}
		
		$sql = "Update tracking set row = 'new',latitude = '$latitude', longitude = '$longitude', added_at='$current_date_time' where tid = $tidold;";
		$sql .= "Update tracking set row = 'old' where tid = $tidnew";
		$result = mysqli_multi_query($con,$sql);
      if($result){
	    header('Content-Type: application/json');
	    echo json_encode(array('status' => true,'status_code' => 200));
	  }else{
	  header('Content-Type: application/json');
	  echo json_encode(array('status' => false,'status_code' => 400));
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