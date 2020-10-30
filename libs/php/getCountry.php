<?php

$string = file_get_contents('countryBorders.json');

$array = json_decode($string, true);

$feature = $array['features'];
$output;

	foreach ($feature as $key => $value) {
        if ($_REQUEST['code'] == $value['properties']['iso_a2']) {
			$output = $value;
		}
	}
	
	header('Content-Type: application/json; charset=UTF-8');

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

echo json_encode($output);


?>
