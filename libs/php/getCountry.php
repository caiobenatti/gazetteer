<?php

$json = file_get_contents("./countryBorders.json");

$output = json_decode($json, true);

$output = $output['features'];

echo json_encode($output);

	// $string = file_get_contents('util/countryBorders.json');

	// $array = json_decode($string, true);

	// $output = $array['features'];
	// $feature;

	// foreach ($output as $key => $value) {
    //     if ($_REQUEST['code']  //SE COLOCAR BAHAMAR POR EXEMPLO ELE RETORNA O JSON DO OBJETO BAHAMAS
    //      == $value['properties']['name']) {
	// 		$feature = $value;
	// 	}
	// }
	
	// header('Content-Type: application/json; charset=UTF-8');

    // echo json_encode($feature);


?>

