<?php

$executionStartTime = microtime(true) / 1000;

$ch = curl_init();

$url = 'http://api.geonames.org/countryCodeJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['long'] . '&username=cbenatti';

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

if ($e = curl_error($ch)) {
    echo $e;
} else {
    $decode = json_decode($result, true);
}

curl_close($ch);


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
