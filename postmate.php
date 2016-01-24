<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: GET, POST');
$url = 'https://api.postmates.com/v1/customers/cus_KeAkAy7GIWj1lF/delivery_quotes';
$key="51a61f0e-4833-4745-9f3d-c48853e76a71";
$fields = array(
	'pickup_address' => urlencode($_POST['pickup_address']),
	'dropoff_address' => urlencode($_POST['dropoff_address'])
	/*'pickup_address' => urlencode($_POST['pickup_address']),
	'pickup_phone_number' => urlencode($_POST['pickup_phone_number']),
	'pickup_notes' => urlencode($_POST['pickup_notes']),
	'dropoff_name' => urlencode($_POST['dropoff_name']),
	'dropoff_address' => urlencode($_POST['dropoff_address']),
	'dropoff_phone_number' => urlencode($_POST['dropoff_phone_number']),
	'dropoff_notes' => urlencode($_POST['dropoff_notes']),
	'manifest' => urlencode($_POST['manifest'])*/
);

$headers = array(
	"authorization"=> "Basic NTFhNjFmMGUtNDgzMy00NzQ1LTlmM2QtYzQ4ODUzZTc2YTcxOg=="//,
	//"Content-Type"=> "application/x-www-form-urlencoded"
);


//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
//curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch,CURLOPT_POSTFIELDS, http_build_query($fields));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_USERPWD, "$key:");
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

//execute post
$result = curl_exec($ch);
echo $result;
echo curl_error($ch);
//close connection
curl_close($ch);
?>