<?php

// return the command from the text file to keep the file 
$file = file_get_contents('4AlexaQueue.txt', FILE_USE_INCLUDE_PATH);
echo $file;
// clear the queue file out

$response = file_get_contents(__DIR__ .'/4AlexaClear.php');

?>