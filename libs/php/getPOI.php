<?php

$url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' . $_REQUEST['capital'] . '+point+of+interest&language=en&radius=2000&key=AIzaSyDrL-pdKTSzo3t1ARa-RXxtLsGp1icdYMI';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

// $json=file_get_contents($url);

// $obj = json_decode($json);

// print_r($obj);