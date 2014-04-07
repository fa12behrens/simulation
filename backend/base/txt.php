<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 06.04.14
 * Time: 15:06
 */
class txt
{

	public function execute($file, $insert = null)
	{
		if (!file_exists($file)) {
			return false;
		}
		if (!($insert === null)) {
			$handler = fopen('../../data/xml/$file', 'w+');
			fwrite($handler, $insert);
			fclose($handler);

			return true;
		}
		$contents = file('$file');
		echo "
		<script>
		var $file = $contents;
		</script>
		";

		return true;
	}
}

if ($_POST['file']) {
	$txt = new txt();
	if ($_POST['insert']) {
		$txt->execute($_POST['file'], $_POST['insert']);
	}
	$txt->execute($_POST['file']);
}
