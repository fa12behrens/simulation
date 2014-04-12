<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 11.04.14
 * Time: 09:26
 */
class jsonHandler
{

	public function execute($data, $list)
	{
		$json = file_get_contents('../json/cash.json');
		$json = json_decode($json, true);

		array_push($json[$list], $data);
		$json = json_encode($json);


		$handle = fopen('../json/cash.json', 'w+');
		fwrite($handle, $json);
		fclose($handle);
	}

}

if (!(empty($_POST['data']) && empty($_POST['data']))) {
	$handler = new jsonHandler();
	$handler->execute($_POST['data'], $_POST['list']);
}