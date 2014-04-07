<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 17.12.13
 * Time: 12:20
 */

class xml {

	public function load($file){
		$xml = simplexml_load_file("../../data/xml/$file");

		echo"
		<script>
		var xml = $xml;
		</script>
		";
	}
}

if ($_POST['file']) {
	$xml = new xml();
	$xml->load($_POST['file']);
}
