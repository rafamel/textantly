<?php

// Allowed formats
$types_allowed = array("png", "jpg", "gif", "tiff", "svg", "exif", "bmp", "webp");

// Ensure User Logged in @ Wordpress
require_once($_SERVER['DOCUMENT_ROOT'].'/wp-blog-header.php');
if ((!is_user_logged_in()) || (!current_user_can("edit_posts"))) {
	echo "Error: User not logged in or without authorization.";
	exit;
}

$img = isset($_GET['img']) ? $_GET['img']:null;

if(!is_null($img)) {
	$type = pathinfo($img, PATHINFO_EXTENSION);
	$data = file_get_contents($img);
	if (in_array($type, $types_allowed)) {
		$img = 'data:image/' . $type . ';base64,' . base64_encode($data);
		echo $img;
	} else {
		echo "Mimetype error.";
	}
}

?>