<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 11.04.14
 * Time: 09:26
 */
class jsonHandler
{
	// This function can be called by js posts,
	// it will just update json file with the given file in the correct list, based on the required parameters.
	public function execute($data, $file, $list)
	{
			$json = file_get_contents('../json/' . $file . '.json');
			$json = json_decode($json, true);

			array_push($json[$list], $data);
			$json = json_encode($json);

		$handle = fopen('../json/' . $file . '.json', 'w+');
		fwrite($handle, $json);
		fclose($handle);
	}

	// This function is called by the DatabaseHandler and overwrite a json file with the new content,
	// usual as api between php and js.
	public function save($data, $file)
	{
		$handle = fopen('../json/' . $file . '.json', 'w+');
		$json = json_encode($data);
		fwrite($handle, $json);
		fclose($handle);
	}
}

// This if query checks, if this file is called with post, if this is true,
// it will execute a instance from the jsonHandler.
if (!(empty($_POST['data']) && empty($_POST['file']))) {
	$handler = new jsonHandler();
	$handler->save($_POST['data'], $_POST['file']);
	if (!empty($_POST['list'])) {
		$handler->execute($_POST['data'], $_POST['file'], $_POST['list']);
	}
}