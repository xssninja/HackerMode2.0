<?php

// return the command from the text file to keep the file 
$cmd = file_get_contents('4KaliQueue___.txt', FILE_USE_INCLUDE_PATH);
// new remove suspect characters
$cmd = str_replace("<","",$cmd);
//$cmd = str_replace("data:","data.",$cmd);
$cmd = str_replace("?>","",$cmd);
$cmd = str_replace("(","",$cmd);
$cmd = str_replace(")","",$cmd);
$cmd = str_replace("//","",$cmd);
$cmd = str_replace("HackerModeQueueData:","",$cmd);

echo $cmd;
// You may need to change _DIR_ to 'https://example.com'
$response = file_get_contents(__DIR__ . '/4KaliClear.php');

?>
