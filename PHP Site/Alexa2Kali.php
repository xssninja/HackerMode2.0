//   HackerMode 2 Auto pwn for Kali and pymetasploit and msfrpcd
//   Copyright (C) 2019 David Cross
//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.
<?php

///////get date/time////////////////
date_default_timezone_set('America/Denver');
$date = date('m/d/Y h:i:s a', time());
////////////////////////////

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$req_dump = basename($_SERVER['REQUEST_URI']);
$cmd = $_GET['cmd'];
//$ip = $_GET['ip'];
$sig = $_GET['sig'];
//$fixedip = str_replace("-",".",$ip);

// create a small CSV
$scan_req = $cmd . "|sig=" . $sig;

//print($req_dump);

// write to a file containing the current scan IP and sinature
$fp = fopen('4KaliQueue.txt','w');
fwrite($fp, $scan_req);
fclose($fp);

// write to a log of all the scan requests that have been receieved over time
$user_ip = getUserIP();
$req_dump = "\n". $date . " Alexa asks Kali " . $scan_req;
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
