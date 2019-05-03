<?php

// return the command from the text file to keep the file 
$file = file_get_contents('4KaliQueue.txt', FILE_USE_INCLUDE_PATH);
echo $file;
$response = file_get_contents(__DIR__ . '/4KaliClear.php');

?>