<?php


$executionStartTime = microtime(true) / 1000;

//$url = 'https://examples.opendatasoft.com/api/records/1.0/search/?dataset=world-heritage-unesco-list&q='. $_REQUEST['q']. '&rows=60&facet=category&facet=country_en&facet=continent_en';
$url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=world-heritage-list%40public-us&q='. $_REQUEST['q']. '&lang=en&rows=60&facet=states';


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

 header('Content-Type: application/json; charset=UTF-8');
 
 echo json_encode($output); 