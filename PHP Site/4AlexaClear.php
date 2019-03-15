<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// clear the CSV
$nothing= "";

// a file containing the current scan IP and sinature
$fp = fopen('4AlexaQueue.txt','w');
fwrite($fp, $nothing);
fclose($fp);

?>