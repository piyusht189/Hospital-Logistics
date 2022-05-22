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

if(!empty($did)){
    $did_array = explode(',', $did);

    $drivers = array();
    for($i = 0;$i < sizeof($did_array); $i++){
    	$did_temp = $did_array[$i];
    	$sql = "Select * from tracking where did = $did_temp";
    	$result = mysqli_query($con,$sql);
    	if(mysqli_num_rows($result) > 0){
			$location_row = array();
            $counter = 0;
            $status_holder = "";
			while($row = mysqli_fetch_assoc($result)){
                // Status Check

                if($counter == 0){
                   $did_for_status = $row['did'];
                   $sql_status = "Select current_status from app_ambulance_drivers where aadid = $did_for_status";
                   $result_status = mysqli_query($con,$sql_status);
                   $row_status = mysqli_fetch_assoc($result_status);
                   $status_holder = $row_status['current_status'];
                }

                // Time difference
                $minutes = 0;
                if($row['row'] == "new"){
                    $oldtime = $row['added_at'];
                    $datetime1 = strtotime($oldtime);
                    $datetime2 = strtotime(gmdate('Y-m-d H:i:s'));
                    $interval  = abs($datetime2 - $datetime1);
                    $minutes   = round($interval / 60);
                    if($minutes < 1){
                        $row['last_online'] = "few seconds";
                    }else{
                        
                       $formatted_time = secondsToTime($minutes*60);
                       $formatted_time_arr = explode(',', $formatted_time);
                       $temp_arr = array();
                       for($j = 0; $j < sizeof($formatted_time_arr); $j++){
                        if($formatted_time_arr[$j][0] != "0"){
                            $temp_arr[] = $formatted_time_arr[$j];
                        }
                       }
                       $formatted_time = implode(', ', $temp_arr);
                       $row['last_online'] = $formatted_time;
                    }

                    //Here add the enroute and Data
                    if($status_holder == true){
                      $query = "select * from tasks_ambulance where aadid = $did_for_status and status='enroute'";
                      $resumed = mysqli_query($con, $query);
                      $total = mysqli_num_rows($resumed); 
                      if($total > 0){
                        $row['enroute'] = true;
                        if(mysqli_num_rows($resumed) > 0){
                          // Enroute in normal task
                          $route_row = mysqli_fetch_assoc($resumed);
                          $row['enroute_data'] = $route_row; 
                        }
                      }else{
                        $row['enroute'] = false;
                      }
                    }else{
                      $row['enroute'] = false;
                    }
                    
                }
                $row['current_status'] = $status_holder;
				$location_row[] = $row;
			}
			$drivers[$did_temp] = $location_row;
	    }else{
	    	$drivers[$did_temp] = array();
	    }
    }

    header('Content-Type: application/json');
    echo json_encode(array('status' => true,'status_code' => 200,'driver_locations' => $drivers));
}
function secondsToTime($seconds) {
    $dtF = new \DateTime('@0');
    $dtT = new \DateTime("@$seconds");
    return $dtF->diff($dtT)->format('%a days,%h hours,%i minutes');
}
mysqli_close($con);
?>