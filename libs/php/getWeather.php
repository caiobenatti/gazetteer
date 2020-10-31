<?php

$executionStartTime = microtime(true) / 1000;

$url = 'http://api.openweathermap.org/data/2.5/forecast?q=' . $_REQUEST['capital'] . '&appid=2e6f3a48a7d1db4218d23364e6a65440';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);


$output = $decode;
$feature = array();

$feature['status']['code'] = "200";
$feature['city'] = $output['city'];

for ($i = 0 ; $i < count($output['list']) ; $i += 8){
    $feature[] = $output['list'][$i];
}

$feature['city'] = $output['city'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($feature);

