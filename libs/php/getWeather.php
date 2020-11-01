<?php

$executionStartTime = microtime(true) / 1000;

$url1 = 'http://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['capital'] . '&units=metric&appid=2e6f3a48a7d1db4218d23364e6a65440';

//$url1 = 'http://api.openweathermap.org/data/2.5/weather?q=london&units=metric&appid=2e6f3a48a7d1db4218d23364e6a65440';


$ch1 = curl_init();
curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_URL, $url1);

$result1 = curl_exec($ch1);

curl_close($ch1);

 $decode1 = json_decode($result1,true);	



$url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' . $decode1['coord']['lat'] . '&lon=' . $decode1['coord']['lon'] . '&exclude=hourly,minutely&units=metric&appid=2e6f3a48a7d1db4218d23364e6a65440';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

 $decode = json_decode($result,true);	

 $output['status']['code'] = "200";
 $output['status']['name'] = "ok";
 $output['status']['description'] = "mission saved";
 $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
 $output['data'] = $decode;
 $output['dataToday'] = $decode1;

 header('Content-Type: application/json; charset=UTF-8');
 
 echo json_encode($output); 
