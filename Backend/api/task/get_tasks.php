<?php
require __DIR__.'/../database.php';



$json = file_get_contents('php://input');

$data = json_decode($json, true);


$did = $data['did'];


if(!empty($did)){
	$sql = "Select * from tasks_ambulance where aadid = $did";
	$result = mysqli_query($con,$sql);
	$drives = array();
	while($row = mysqli_fetch_assoc($result))
	{
	   if($row['status'] == 'enroute'){
	   	$did = $row['aadid'];
	   	$getVehicle = "select dvid,dvname,dvcolor from driver_vehicles where hired = $did";
	   	$vehicleResult = mysqli_query($con, $getVehicle);
	   	$vehicleRow = mysqli_fetch_assoc($vehicleResult);
	   	$row['vehicle'] = $vehicleRow;
 	   }
	   $drives[] = $row;
	   
	}
	header('Content-Type: application/json');
	echo json_encode(array('status_code' => 200,'drives' => $drives));
}
 
mysqli_close($con);

?>