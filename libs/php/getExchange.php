<?php

$executionStartTime = microtime(true) / 1000;

$url = 'https://openexchangerates.org/api/historical/' . date("Y-m-d") . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';

$history = Array();

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

$history[] = $output;

///////////////////////////////////////////////

$url1 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url1);

$result1 = curl_exec($ch);

curl_close($ch);

$decode1 = json_decode($result1, true);

$output1['data'] = $decode1;

$history[] = $output1;

///////////////////////////////////////////////

$url2 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 2) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url2);

$result2 = curl_exec($ch);

curl_close($ch);

$decode2 = json_decode($result2, true);

$output2['data'] = $decode2;

$history[] = $output2;

///////////////////////////////////////////////

$url3 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 3) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url3);

$result3 = curl_exec($ch);

curl_close($ch);

$decode3 = json_decode($result3, true);

$output3['data'] = $decode3;

$history[] = $output3;

///////////////////////////////////////////////

$url4 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 4) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url4);

$result4 = curl_exec($ch);

curl_close($ch);
$decode4 = json_decode($result4, true);

$output4['data'] = $decode4;

$history[] = $output4;

///////////////////////////////////////////////

$url5 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 5) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url5);

$result5 = curl_exec($ch);

curl_close($ch);

$decode5 = json_decode($result5, true);

$output5['data'] = $decode5;

$history[] = $output5;

///////////////////////////////////////////////

// $url6 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 6) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url6);

// $result6 = curl_exec($ch);

// curl_close($ch);

// $decode6 = json_decode($result6, true);

// $output6['data'] = $decode6;

// $history[] = $output6;

// ///////////////////////////////////////////////

// $url7 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 7) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url7);

// $result7 = curl_exec($ch);

// curl_close($ch);

// $decode7 = json_decode($result7, true);

// $output7['data'] = $decode7;

// $history[] = $output7;

// ///////////////////////////////////////////////

// $url9 = 'https://openexchangerates.org/api/historical/' . date("Y-m-d", time() - 60 * 60 *24 * 9) . '.json?app_id=10570626c94e460c85ccda281cbfc5e8%20&base=USD';


// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url9);

// $result9 = curl_exec($ch);

// curl_close($ch);

// $decode9 = json_decode($result9, true);

// $output9['data'] = $decode9;

// $history[] = $output9;

///////////////////////////////////////////////

echo json_encode($history);
