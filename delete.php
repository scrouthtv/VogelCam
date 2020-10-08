<?php
require_once("config.php");
// deletes the $_GET["file"] if it is in the folder specified in config.
// NO MORE CHECKS ARE DONE. NO DIALOGS ASKED. NO PERMISSIONS CHECKED.

$files = scandir($FOLDER);
$todelete = str_replace(" ", "+", $_GET["file"]);

foreach ($files as $file) {
	if ($file == $todelete) {
		error_reporting(E_WARNING);
		if (!unlink(realpath($FOLDER . "/" . $file))) {
			echo error_get_last()["message"];
		} else {
			echo "Success.";
		}
		break;
	}
}

?>
