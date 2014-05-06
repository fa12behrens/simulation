<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 19.04.14
 * Time: 14:32
 */

include_once ('model/cash.php');
include_once ('model/human.php');
include_once ('model/human_type.php');
include_once ('jsonHandler.php');

class databaseHandler
{

	private $sql;
	private $file;

	public function execute($table_name, $type, $data = null)
	{
		$this->file = $table_name;
		$this->setSql($table_name, $type, $data);
		$this->query();
	}

	private function query()
	{
		$mysql_host = '127.0.0.1';
		$mysql_user = 'root';
		$mysql_password = 'root';
		$mysql_dbname = 'simulator';

		$mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_dbname);

		if($mysqli->connect_errno > 0){
			die('Unable to connect to database [' . $mysqli->connect_error . ']');
		}

		if(!$result = $mysqli->query($this->sql)){
			die('There was an error running the query [' . $mysqli->error . ']');
		}

		if(isset($result) && !is_bool($result)){
		while($row = $result->fetch_assoc()){
			$return[] = $row;
		}
		}
		if(isset($return)){
		$json = new jsonHandler();
		$json->save($return, $this->file);
		}
	}

	private function setSql($table_name, $type, $data = null)
	{
		$model = new $table_name();
		$this->sql = $model->getSql($type, $data);
	}
}

if (!(empty($_POST['table_name']) && empty($_POST['type']))) {
	$handler = new databaseHandler();
	if (empty($_POST['data'])){
		$handler->execute($_POST['table_name'], $_POST['type']);
	}else{
		$handler->execute($_POST['table_name'], $_POST['type'], json_decode($_POST['data']));
	}
}
/*
else{
	$handler = new databaseHandler();
	$handler->execute("human","create",array("name"=>"Caitlyn","gender"=>"female","human_type_id"=>"1"));
}
else{
	$handler = new databaseHandler();
	$handler->execute("human","delete", 9);
}
else{
	$handler = new databaseHandler();
	$handler->execute("human_type","loadByType", 1);
}
*/