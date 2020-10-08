<?php
require_once("config.php");

$files = scandir($FOLDER);
$data = array();

$meta = array();
$meta["folder"] = $FOLDER;
$meta["free"] = disk_free_space($FOLDER);
$meta["total"] = disk_total_space($FOLDER);
$data[] = $meta;

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
$data[0]["amount"] = $index + 1;
echo json_encode($data);

?>
