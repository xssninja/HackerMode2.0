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

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// clear the CSV
$nothing= "";

// a file containing the current scan IP and sinature
$fp = fopen('4AlexaQueue.txt','w');
fwrite($fp, $nothing);
fclose($fp);

?>
