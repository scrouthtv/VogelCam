<?php
require_once("config.php");

$files = scandir($FOLDER);

foreach ($files as $index => $file) {
	$file = realpath($FOLDER . "/" . $file);
	//echo "<br />";
	//echo "file:" . $file . "<br/>";
	//echo "stat:";
	//echo $stat . "<br/>";
	//echo "--<br />";
	$files[$index] = array_slice(stat($file), 13);
	// 0 - device number
	// 1 - inode number
	// 2 - inode protection mode
	// 3 - number of links
	// 4 - userid of owner
	// 5 - groupid of owner
	// 6 - device type
	// 7 - size in bytes
	// 8 - unix timestamp of last access
	// 9 - unix timestamp of last modification
	// 10 - unix timestamp of last inode change
	// 11 - blocksize of filesystem IO
	// 12 - number of 512-byte blocks allocated
}
echo json_encode($files);

?>
