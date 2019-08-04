<?php

///////get date/time/////////CHANGE YOUR TIME ZONE///////
date_default_timezone_set('America/Denver');
$date = date('m/d/Y h:i:s a', time());
////////////////////////////

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$req_dump = basename($_SERVER['REQUEST_URI']);
$cmd = $_POST['cmd'];
//$ip = $_POST['ip'];
$sig = $_POST['sig']; // sig should be in the Json
//$fixedip = str_replace("-",".",$ip);

// new remove suspect characters
$cmd = str_replace("<","",$cmd);
//$cmd = str_replace("data:","data.",$cmd);
$cmd = str_replace("?>","",$cmd);
$cmd = str_replace("(","",$cmd);
$cmd = str_replace(")","",$cmd);
$cmd = str_replace("//","",$cmd);
$cmd = "HackerModeQueueData:" . $cmd;

// create a small CSV
$alexa_req = $cmd . "|sig=" . $sig;
//print($alexa_req);

// a file containing the current scan IP and sinature
$fp = fopen('4AlexaQueue.txt','w');
fwrite($fp, $alexa_req );
fclose($fp);

// a log of all the alexa_req requests that have been receieved over time
$user_ip = getUserIP();
$req_dump = "\n". $date . " Kali@" . $user_ip . " says:\n " . $alexa_req ;
$fpp = fopen('allscanIPrequests.log', 'a');
fwrite($fpp, $req_dump);
fclose($fpp);


function getUserIP()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $pip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $pip = $forward;
    }
    else
    {
        $pip = $remote;
    }
    return $pip;
}


?>
