<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 25.04.14
 * Time: 13:33
 */


class cash
{

	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `cash`";
				break;
			case 'create':
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`cash` (
								`id` ,
								`transfer` ,
								`timestamp`
								)
								VALUES (
								NULL ,  $data, NULL)";
				}
				break;
			default:
				$this->sql = "SELECT * FROM `cash`";
				break;
		}

		return $this->sql;
	}

}
