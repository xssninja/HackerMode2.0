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

// return the command from the text file to keep the file 
$file = file_get_contents('4AlexaQueue.txt', FILE_USE_INCLUDE_PATH);
echo $file;
// clear the queue file out
$response = file_get_contents('https://{mydomain.com}/4AlexaClear.php');

?>
