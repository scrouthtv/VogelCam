<?php
require_once("config.php");

$files = scandir($FOLDER);
$data = array();

foreach ($files as $index => $file) {
	if ($file == "." || $file == "..") continue;
	$path = realpath($FOLDER . "/" . $file);
	//echo "<br />";
	//echo "file:" . $file . "<br/>";
	//echo "stat:";
	//echo $stat . "<br/>";
	//echo "--<br />";
	$stat = array_slice(stat($path), 13);
	if ($stat != false) {
		$stat["name"] = $file;
		if ($CHECK_MIME) $stat["type"] = mime_content_type($path);
		$data[] = $stat;
	}
}
echo json_encode($data);

?>
