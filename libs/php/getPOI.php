<?php

$url = 'https://api.opentripmap.com/0.1/en/places/geoname?name=' . $_REQUEST['countryName'] . '&apikey=5ae2e3f221c38a28845f05b67516b936509f05908b688acc0e775df9';

echo $url;

// ' . $_REQUEST['countryName'] . '

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

// $json=file_get_contents($url);

// $obj = json_decode($json);

// $obj['status']['code'] = "200";

// echo json_encode($obj);