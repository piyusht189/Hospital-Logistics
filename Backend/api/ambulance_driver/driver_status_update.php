<?php
require __DIR__.'/../database.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json = file_get_contents('php://input');

$data = json_decode($json, true);

$aadid = $data['did'];
$status = $data['status'];
$today_date = gmdate('Ymd');
$now_time = gmdate('YmdHis');

$datetime = new DateTime();
$datetime->modify('-1 days');
$yest_date = $datetime->format('Ymd');

if(!empty($aadid) && !empty($status)){
	
	$sql = "Update app_ambulance_drivers set current_status='$status' where aadid = $aadid";
	$result = mysqli_query($con,$sql);
    if($result)
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 200,'message' => 'Status Updated Successfully'));
	



	$sql = "Select * from ambulance_drive_logs where record_date = '$today_date' and did = $aadid";
	$result = mysqli_query($con, $sql);
	if(mysqli_num_rows($result) > 0){
		// Push/Add time to list
		$row = mysqli_fetch_assoc($result);
    	$log_data = json_decode($row['log'], true);
    	$log_length = sizeof($log_data);
    	$last_log = (object) $log_data[$log_length - 1];
    	
    	if(!property_exists($last_log,'offline') && $status == "offline"){
    		// Add offline
    		$last_log->offline = $now_time;
    		$log_data[$log_length - 1] = $last_log;
    	   	$log_temp = json_encode($log_data);
    	    $sql = "Update ambulance_drive_logs set log = '$log_temp' where record_date = '$today_date' and did = $aadid";
    	   	$result = mysqli_query($con, $sql);
    	}else if($status == "online"){
    		// Add online
    		$log = array("online" => $now_time);
    	   	$log_data[] = $log;
    	   	$log_temp = json_encode($log_data);
    	   	$sql = "Update ambulance_drive_logs set log = '$log_temp' where record_date = '$today_date' and did = $aadid";
    	   	$result = mysqli_query($con, $sql);
    	}

	}else{
		// Insert new record
		$sql = "Select * from ambulance_drive_logs where record_date = '$yest_date' and did = $aadid";
	    $result = mysqli_query($con, $sql);
	    if(mysqli_num_rows($result) > 0){
	    	// Yesterday log is their
	    	$row = mysqli_fetch_assoc($result);
	    	$log_data = json_decode($row['log'], true);
	    	$log_length = sizeof($log_data);
	    	if($log_length > 0){
	    	   $last_log = (object) $log_data[$log_length - 1];
	    	   if(!property_exists($last_log,'offline') && $status == "offline" && property_exists($last_log,'online')){
	    	   	  // Concatenate and complete bridge
	    	   	$last_log->offline = $now_time;
	    	   	$log_data[$log_length - 1] = $last_log;
	    	   	$log = json_encode($log_data);
	    	    $sql = "Update ambulance_drive_logs set log = '$log' where record_date = '$yest_date' and did = $aadid";
	    	   	$result = mysqli_query($con, $sql);

	    	   }else if($status == "online"){
	    	   	// Insert new record as Yesterday Completed
	    	   	$log = array("online" => $now_time);
	    	   	$log_arr = array();
	    	   	$log_arr[] = $log;
	    	   	$log_temp = json_encode($log_arr);
	    	   	$sql = "Insert into ambulance_drive_logs(did,record_date, log) values($aadid, '$today_date', '$log_temp')";
	    	   	$result = mysqli_query($con, $sql);

	    	   }
	        }else if($status == "online"){
	        	// Yesterday Log Empty
	        	$log = array("online" => $now_time);
	    	   	$log_arr = array();
	    	   	$log_arr[] = $log;
	    	   	$log_temp = json_encode($log_arr);
	    	   	$sql = "Insert into ambulance_drive_logs(did, record_date, log) values($aadid, '$today_date', '$log_temp')";
	    	   	$result = mysqli_query($con, $sql);
	        }
	    }else if($status == "online"){
	    	// Yesterday log not available
	    	$log = array("online" => $now_time);
    	   	$log_arr = array();
    	   	$log_arr[] = $log;
    	   	$log_temp = json_encode($log_arr);
    	   	$sql = "Insert into ambulance_drive_logs(did, record_date, log) values($aadid, '$today_date', '$log_temp')";
    	   	$result = mysqli_query($con, $sql);
	    }
		
	}

	}
	else
	{
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 400,'message' => 'Something went wrong.'));
	}

	
}
	mysqli_close($con);
?>