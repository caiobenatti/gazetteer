<?php

$string = file_get_contents('../util/countryBorders.json');
$array = json_decode($string, true);

$output = $array['features'];
$feature = array();

$feature['code'] = "200";

foreach ($output as $key => $value) {
    $feature[] = array('name' => $value['properties']['name']);
}

sort($feature);
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($feature);


