<?php
require __DIR__.'/../database.php';



$json = file_get_contents('php://input');

$data = json_decode($json, true);


$did = $data['did'];
$flag = $data['today'];


$today_date = date('Y-m-d');

if(!empty($did)){
	if(!empty($flag)){
	    $sql = "Select * from completed_ambulance_tasks where aadid = $did and SUBSTRING(ended_at, 1, 10) = '$today_date'";
    }else{
    	$sql = "Select * from completed_ambulance_tasks where aadid = $did";
    }
	$result = mysqli_query($con,$sql);
	$drives = array();
	while($row = mysqli_fetch_assoc($result))
	{
	   $drives[] = $row;
	   
	}
	header('Content-Type: application/json');
	echo json_encode(array('status_code' => 200,'drives' => $drives));
}
 
mysqli_close($con);

?>