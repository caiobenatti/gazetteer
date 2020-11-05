<?php


$executionStartTime = microtime(true) / 1000;
$url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=84646e53dce75abf02d3921e9c1dc9d5&text=united+kingdom&per_page=&format=json&nojsoncallback=1&auth_token=72157716769376107-8ced23f4d75801ac&api_sig=6436777a8f85d9a5f4e4e47bcb6ada25';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

 $decode = json_decode($result,true);	

 $output['status']['code'] = "200";
 $output['status']['name'] = "ok";
 $output['status']['description'] = "mission saved";
 $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
 $output['data'] = $decode;

 header('Content-Type: application/json; charset=UTF-8');
 
 echo json_encode($output); 


// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg