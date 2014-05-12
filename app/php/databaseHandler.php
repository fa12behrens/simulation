<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 19.04.14
 * Time: 14:32
 */
// Include all models and the jsonHandler
include_once('model/cash.php');
include_once('model/order.php');
include_once('model/human.php');
include_once('model/human_type.php');
include_once('model/human_has_order.php');
include_once('model/human_has_product.php');
include_once('model/resources.php');
include_once('model/resource_type.php');
include_once('model/product.php');
include_once('model/product_type.php');
include_once('jsonHandler.php');

class databaseHandler
{

	// contains the database query as sql
	private $sql;
	// contains the filename which is required by jsonHandler,
	// he is used to save the result into json, because angular can easily read json.
	private $file;

	// This function run the complete databaseHandler,
	// by set sql, file and  run the query function.
	public function execute($table_name, $type, $data = null)
	{
		$this->file = $table_name;
		$this->setSql($table_name, $type, $data);
		//var_dump($this->sql);die;
		$this->query();
	}

	// This function handle the database access
	// by define mysqli, connect to the database, perform the sql query and fetch the result,
	// if a result is given, the jsonHandler will be called with the result and the filename (/FILENAME.txt) as parameter
	private function query()
	{
		$mysql_host = '127.0.0.1';
		$mysql_user = 'root';
		$mysql_password = 'root';
		$mysql_dbname = 'simulator';

		$mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_dbname);

		if ($mysqli->connect_errno > 0) {
			die('Unable to connect to database [' . $mysqli->connect_error . ']');
		}

		if (!$result = $mysqli->query($this->sql)) {
			die('There was an error running the query [' . $mysqli->error . ']');
		}

		if (isset($result) && !is_bool($result)) {
			while ($row = $result->fetch_assoc()) {
				$return[] = $row;
			}
		}
		if (isset($return)) {
			$json = new jsonHandler();
			$json->save($return, $this->file);
		}
	}

	// Call one of the models to get and return the sql query.
	// The models have the same name as the db tables so we can create a dynamic instance.
	// The type is like load, delete, create ... and is controlled by a switch on the other side.
	// Data can be an array or a string or a int which contains not just data,
	// it can have ids or other criteria too.
	// All of this parameters are given by the javascript post.
	private function setSql($table_name, $type, $data = null)
	{
		$model = new $table_name();
		$this->sql = $model->getSql($type, $data);
	}
}

// This if query checks, if this file is called with post, if this is true,
// he create a new instance and execute with or without data based of the posted data.
if (!(empty($_POST['table_name']) && empty($_POST['type']))) {
	$handler = new databaseHandler();
	if (empty($_POST['data'])) {
		$handler->execute($_POST['table_name'], $_POST['type']);
	} else {
		$handler->execute($_POST['table_name'], $_POST['type'], json_decode($_POST['data']));
	}
} /*
else{
	$handler = new databaseHandler();
	$handler->execute("human","create",array("name"=>"Caitlyn","gender"=>"female","human_type_id"=>"1"));
}
else{
	$handler = new databaseHandler();
	$handler->execute("human","delete", 9);
}

else {
	$handler = new databaseHandler();
	$data = ["2014-5-14", 17, 1] ;
	$handler->execute("human_has_order", "deleteByHuman", 3);
}
*/