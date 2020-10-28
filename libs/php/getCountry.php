<?php

$json = file_get_contents("./countryBorders.json");



$output = json_decode($json, true);

// echo $output;
// echo "<br>";
// echo $output['features'][0]['properties']['iso_a3'];

// echo "<br>";
// echo count($output['features']);

$output = $output['features'];

// echo "<br>";
echo json_encode($output);


// $feature;
// foreach ($output as $key => $value) {
// 	if ( 'AFG' == $value['properties']['iso_a3']) {
// 		$feature = $value;
// 	}
// }

// header('Content-Type: application/json; charset=UTF-8');

// echo "test";
// echo json_encode($feature);

// $_REQUEST['code']
?>

