<?php
require __DIR__.'/../database.php';

define( 'API_ACCESS_KEY', 'AAAAzh9rKHw:APA91bGtHllf4gUkcCmAJqiwvcQgBhrkApY6mrp8MlmaepIeYhPNCvwzkXxsb3YRuyrualGUtzi7XM9mzGJqPXb-Nnx1xLiY6IGRWWh4TeV6kMUHnm_ZhC6u3vFHBNvbqRh--bS4COHd' );

$json = file_get_contents('php://input');

$data = json_decode($json, true);


$pointer = $data['pointer'];
$tid = $data['tid'];
$dvid = $data['dvid'];
$lat = $data['lat'];
$lng = $data['lng'];
$current_date_time = gmdate('Y-m-d H:i:s');
$completed_flag = $data['completed_flag'];


if(!empty($tid) && !empty($lat) && !empty($lng)){

	$sql = "Select * from tasks_ambulance where atid=$tid";
	$result = mysqli_query($con,$sql);
	if(mysqli_num_rows($result)){
		$row = mysqli_fetch_assoc($result);
        $did = $row['aadid'];
		if($pointer == 'init'){
			//Insert "enroute"
			$checker = "Select * from driver_vehicles where dvid=$dvid and hired = 0";
			$checkr_result = mysqli_query($con, $checker);
			if(mysqli_num_rows($checkr_result) == 0){
				  header('Content-Type: application/json');
			      echo json_encode(array('status' => false,'status_code' => 400,'message' => 'Vehicle is already hired or Not Available!'));
			}else{
			 $hirer = "Update driver_vehicles set hired=$did where dvid =$dvid";
		     $hirer_result = mysqli_query($con, $hirer);
		     if($hirer_result){
			 $sql = "Update tasks_ambulance set status = 'enroute',started_at = '$current_date_time' where atid=$tid";
		     $result = mysqli_query($con,$sql);
		     if($result){
		     	header('Content-Type: application/json');
	            echo json_encode(array('status_code' => 200,'work' => 0));
		     }else{
                header('Content-Type: application/json');
		        echo json_encode(array('status' => false,'status_code' => 800));
		     }
		    }else{
		    	header('Content-Type: application/json');
		        echo json_encode(array('status' => false,'status_code' => 400,'message' => 'Vehicle is already hired or Not Available!'));
		    }
		   }
		}else{

			$work_log = json_decode($row['work_log'], true);
			$compare_lat = $work_log[$pointer]['lat'];
			$compare_lng = $work_log[$pointer]['lng'];

			$distance = distance($compare_lat,$compare_lng, $lat, $lng);
			//if($distance*1000 > 500){
			//	header('Content-Type: application/json');
	        //    echo json_encode(array('status_code' => 400,'message' => 'You are not at the location!'));
			//}else{
				//Distance Pass


				$work_log[$pointer]['reached'] = true;
				$work_log[$pointer]['oldlat'] = $work_log[$pointer]['lat'];
				$work_log[$pointer]['oldlng'] = $work_log[$pointer]['lng'];
				$work_log[$pointer]['lat'] = $lat;
				$work_log[$pointer]['lng'] = $lng;
				$work_log_format = new stdClass();
				
				for($i = 0; $i <  sizeof($work_log); $i++){
						$work_log_format -> $i =  $work_log[$i];
				}
				$str_work_log = json_encode($work_log_format);
				$now = null;


				if($work_log[$pointer+1]){
					$now = (int)$pointer + 1;
					$next = null;
					if(property_exists($work_log,$now+1)){
						$next = $now + 1;
					}
					$sql = "Update tasks_ambulance set work_log = '$str_work_log',current_work='$now',next_work='$next' where atid=$tid";
					 $result = mysqli_query($con,$sql);
			         if($result){
			         	header('Content-Type: application/json');
			         	echo json_encode(array('status_code' => 200,'work' => $pointer + 1));
			         }else{
			         	header('Content-Type: application/json');
		  				echo json_encode(array('status_code' => 400,'message' => 'No drive found'));
			         }
				}else{
					//Completed
					
					$started_at = $row['started_at'];
					$checker = "Select dvid,hid,dvname,dvnumber,dvcolor,dvreg_no,djoining_date,dvtankcapacity from driver_vehicles where dvid=$dvid";
					
			        $checkr_result = mysqli_query($con, $checker);
			        $checker_row = mysqli_fetch_assoc($checkr_result);
			        $checker_row_final = json_encode($checker_row);
			        $sql = "Insert into completed_ambulance_tasks(taid, aadid, work_log,status, created_at, started_at, ended_at, vehicle) values($tid, $did, '$str_work_log','completed','$current_date_time','$started_at', '$current_date_time','$checker_row_final')";

					$result = mysqli_query($con, $sql);
					$sql1 = "Delete from tasks_ambulance where atid=$tid";
					$result1 = mysqli_query($con, $sql1);
					
						$remove_vehicle = "Update driver_vehicles set hired = 0 where dvid=$dvid";
						$result2 = mysqli_query($con, $remove_vehicle);
						if($result && $result1 && $result2){
							header('Content-Type: application/json');
				         	echo json_encode(array('status_code' => 200,'work' => 'completed'));
						}else{
							header('Content-Type: application/json');
			  				echo json_encode(array('status_code' => 400,'message' => 'Something went wrong!'));
						}
					



					// Background Start Calculation google
					$json_log = json_decode($row['work_log'], true);
					$start_lat = $json_log['0']['lat'];
					$start_lng = $json_log['0']['lng'];
					$end_lat = $json_log[''.(sizeof($json_log)-1)]['lat'];
					$end_lng = $json_log[''.(sizeof($json_log)-1)]['lng'];
					$time1 = new DateTime($row['started_at']);
					$time2 = new DateTime($row['ended_at']);
					$timediff = $time1->diff($time2);
					$unformated =  $timediff->format('%y,%m,%d,%h,%i,%s'); 
					$arr_temp = explode(",",$unformated);
					$time_did = '';
					if($arr_temp[0] != '0'){
						$time_did = (int)$arr_temp[0].((int)$arr_temp[0] > 1?' years':'year');
						$time_did = $time_did.' ';
					}
					if($arr_temp[1] != '0'){
						$time_did = $time_did.((int)$arr_temp[1].((int)$arr_temp[1] > 1?' months':' month'));
						$time_did = $time_did.' ';
					}
					if($arr_temp[2] != '0'){
						$time_did = $time_did.((int)$arr_temp[2].((int)$arr_temp[2] > 1?' days':' day'));
						$time_did = $time_did.' ';
					}
					if($arr_temp[3] != '0'){
						$time_did = $time_did.((int)$arr_temp[3].((int)$arr_temp[3] > 1?' hrs':' hr'));
						$time_did = $time_did.' ';
					}
					if($arr_temp[4] != '0'){
						$time_did = $time_did.((int)$arr_temp[4].((int)$arr_temp[4] > 1?' mins':' min'));
						$time_did = $time_did.' ';
					}
					if($arr_temp[5] != '0'){
						$time_did = $time_did.((int)$arr_temp[5].((int)$arr_temp[5] > 1?' secs':' sec'));
					}
					$time_did;
					$google_obj = GetDrivingDistance($start_lat,$end_lat,$start_lng,$end_lng);
					$time_should = $google_obj['time'];
					$distance = $google_obj['distance'];
					$catid = $row['catid'];

	                
	                $minutes = $timediff->days * 24 * 60;
					$minutes += $timediff->h * 60;
					$minutes += $timediff->i;
					$min_diff = $minutes;


				

					
					
					if(!empty($time_did) && !empty($time_should) && !empty($distance)){
						$query = "Update completed_ambulance_tasks set mins = '$min_diff',total_distance = '$distance',time_should = '$time_should',time_did='$time_did' where taid = $tid";
						mysqli_query($con,$query); 
					}


			    $didget = "select * from app_ambulance_drivers where aadid=$did";
			    $resultdid = mysqli_query($con, $didget);
			    $rowdid = mysqli_fetch_assoc($resultdid);
			    $hid = $rowdid['hid'];

			    $sql = "select noti_token from user where hid=$hid";
				$result = mysqli_query($con, $sql);
				$row = mysqli_fetch_assoc($result);
				$noti_token = $row['noti_token'];
					// Sending Noti to Hospital
			   $title1  = "Yayy, Driver: ".$rowdid['dname']." completed below trip!";
			   $body1 = $json_log['0']['message'].'->'.$json_log['1']['message'].'...';
			   $sql = "Insert into hospital_notifications(hid,title,body,sent_at) values($hid,'$title1','$body1','$current_date_time')";
				$result = mysqli_query($con, $sql);
				$msg = array
				(
				    'body'  => $body1,
				    'title'     => $title1,
				    'vibrate'   => 1,
				    'sound'     => 1,
				);

				$fields = array
				(
				   // 'to'  => $noti_token,
				    'registration_ids'  => [$noti_token],
				    'priority' => 'high',
				    'notification' => $msg
				);

				$headers = array
				(
				    'Authorization: key='.API_ACCESS_KEY,
				    'Content-Type: application/json'
				);

				$ch = curl_init();
				curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
				curl_setopt( $ch,CURLOPT_POST, true );
				curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
				curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
				curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
				$result = curl_exec($ch );
				curl_close( $ch );
				}
				
				
			}
		

	}else{
	  header('Content-Type: application/json');
	  echo json_encode(array('status_code' => 400,'message' => 'No drive found'));
	}
		

	   
	
}
 
mysqli_close($con);
function GetDrivingDistance($lat1, $lat2, $long1, $long2){
	    $url = "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyDSajiOQJxvgkAWjhA6ZOjUHi83ju_ACwE&origins=".$lat1.",".$long1."&destinations=".$lat2.",".$long2."&mode=driving";
	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
	    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	    $response = curl_exec($ch);
	    curl_close($ch);
	    $response_a = json_decode($response, true);
	    $dist = $response_a['rows'][0]['elements'][0]['distance']['text'];
	    $time = $response_a['rows'][0]['elements'][0]['duration']['text'];

	    return array('distance' => $dist, 'time' => $time);
	}
function distance($lat1, $lon1, $lat2, $lon2) {

  $theta = $lon1 - $lon2;
  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
  $dist = acos($dist);
  $dist = rad2deg($dist);
  $miles = $dist * 60 * 1.1515;
  return ($miles * 1.609344); // KM
}

?>