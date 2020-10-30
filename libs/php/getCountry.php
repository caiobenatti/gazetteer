<?php

$string = file_get_contents('countryBorders.json');

$array = json_decode($string, true);

$output = $array['features'];
$feature;

	foreach ($output as $key => $value) {
        if ($_REQUEST['code'] == $value['properties']['iso_a2']) {
			$feature = $value;
		}
	}
	
	header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($feature);


?>
