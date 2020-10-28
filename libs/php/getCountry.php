<?php

$json = file_get_contents("./countryBorders.json");

$output = json_decode($json, true);

$output = $output['features'];

echo json_encode($output);

?>

