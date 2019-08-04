<?php
// return the command from the text file to keep the file 
$cmd = file_get_contents('4AlexaQueue.txt', FILE_USE_INCLUDE_PATH);
// new remove suspect characters
$cmd = str_replace("<","",$cmd);
$cmd = str_replace("?>","",$cmd);
$cmd = str_replace("(","",$cmd);
$cmd = str_replace(")","",$cmd);
$cmd = str_replace("//","",$cmd);
$cmd = str_replace("HackerModeQueueData:","",$cmd);

echo $cmd;
// clear the queue file out... you may need to replace _DIR_ with your domain like this:
//$response = file_get_contents('https://example.com/4AlexaClear.php');
$response = file_get_contents(__DIR__ .'/4AlexaClear.php');
?>
