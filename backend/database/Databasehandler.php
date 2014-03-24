<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 21.03.14
 * Time: 10:57
 */

namespace backend\database;


class Databasehandler
{

	private $sql = array();
	private $arr;

	public function __construct(array $arr = null)
	{
		if ($arr !== null) {
			$this->arr = $arr;
			foreach ($arr['column'] as $column => $value) {
				$this->sql[] = "Insert INTO $arr[table]
						 	  ($column)
							  VALUES
							  ($value)";
			}
		}
		$this->sql = 'SELECT *
					  FROM *
					  WHERE true';
	}

	public function execute()
	{
		$db = $this->connect();
		$result = $this->doQuery($db);

		return $result;
	}

	private function connect()
	{ // host user passwort database
		$db = mysqli_connect("localhost", "root", "root", "simulator");
		if (!$db) {
			exit("Verbindungsfehler: " . mysqli_connect_error());
		}

		return $db;
	}

	private function doQuery($db)
	{
		foreach ($this->sql as $sql) {
			$result = mysqli_query($db, $sql);
		}

		return $result;
	}
}

# just a alpha version, i think it will changed often in our development progress
# you need to chnage your mysql password in phpmyadmin and in xampp/phpmyadmin/config.inc.php
#$go = new Databasehandler();
#$go->execute();