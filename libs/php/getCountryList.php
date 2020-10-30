<?php

$string = file_get_contents('util/countryBorders.json');
$array = json_decode($string, true);

$output = $array['features'];
$feature = array();

foreach ($output as $key => $value) {
    $feature[] = array('name' => $value['properties']['name'], 'iso_a2' => $value['properties']['iso_a2']);
}
sort($feature);
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($feature);

