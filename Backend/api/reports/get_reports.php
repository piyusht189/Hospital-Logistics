<?php
require __DIR__.'/../database.php';



$json = file_get_contents('php://input');

$data = json_decode($json, true);


$hid = $data['hid'];
$from = $data['from'];
$to = $data['to'];
$demail = $data['demail'];


if(!empty($hid) && !empty($from) && !empty($to)){
	$sql = '';
	if(!empty($demail)){
		$sql = "Select aadid,dname,demail,dphone from app_ambulance_drivers where hid = $hid and demail = '$demail'";
	}else{
		$sql = "Select aadid,dname,demail,dphone from app_ambulance_drivers where hid = $hid";
	}
  	if($result = mysqli_query($con,$sql))
	{
		$drivers = array();
		while($row =  mysqli_fetch_assoc($result)){
			// Per Driver Calculation
			$did = $row['aadid'];
			$drives = "select * from completed_ambulance_tasks where status='completed' AND aadid = $did";
			$result_drives = mysqli_query($con, $drives);
			$total_distance = 0;
			$total_mins = 0;
			while($drive_row = mysqli_fetch_assoc($result_drives)){

				$myDateTime = DateTime::createFromFormat('Y-m-d H:i:s', $drive_row['started_at']);
                $drive_start_time = $myDateTime->format('Y-m-d');
				if($drive_start_time >=  $from && $drive_start_time <=  $to){
					$arr = explode(' ',$drive_row['total_distance']);
					$total_distance = $total_distance + (float)$arr[0];

					$total_mins = $total_mins + (int)$drive_row['mins'];
				}
			}
			$total_time = intdiv($total_mins, 60).' hrs '. ($total_mins % 60) . ' mins';


			$now = gmdate('Ymd');
			$myDateTime = DateTime::createFromFormat('Y-m-d', $from);
            $from_temp = $myDateTime->format('Ymd');
            $myDateTime = DateTime::createFromFormat('Y-m-d', $to);
            $to_temp = $myDateTime->format('Ymd');
			$drives = "select * from ambulance_drive_logs where record_date>='$from_temp' AND record_date<='$to_temp' AND did = $did";
			$result_drives = mysqli_query($con, $drives);
			$total_work_mins = 0;
			$times = array();
			while($log_row = mysqli_fetch_assoc($result_drives)){
					$log = json_decode($log_row['log'], true);
					for($i = 0; $i < sizeof($log); $i++){
						$obj = (object) $log[$i];
						if(property_exists($obj, "online") && property_exists($obj, "offline")){
							$times[] = $obj;
							$time = new DateTime($obj->offline);
							$diff = $time->diff(new DateTime($obj->online));
							$minutes = ($diff->days * 24 * 60) +
							           ($diff->h * 60) + $diff->i;
							$total_work_mins = $total_work_mins + $minutes;
                            
						}
					}				    
			}
			$hours = floor($total_work_mins / 60);
			$min = $total_work_mins - ($hours * 60);
            $diffstr = $hours.' hrs '.$min.' mins';
            $row["total_work_time"] = $diffstr; 
            $row["total_work_time_log"] = $times; 
			$row["total_distance"] = $total_distance; 
			$row["total_time"] = $total_time;

			$drivers[] = $row;
		}
		header('Content-Type: application/json');
		echo json_encode(array('status_code' => 200,'drivers' => $drivers));

	}
}
mysqli_close($con);


?>