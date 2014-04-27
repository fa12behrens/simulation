<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 27.04.14
 * Time: 17:53
 */

class resources {

	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `resources` r
				INNER JOIN `resource_type` rt ON r.resource_type_id = rt.id";
				break;
			case 'create':
				$durability = $data['durability'];
				$amount = $data['amount'];
				$resource_type_id = $data['resource_type_id'];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`resources` (
								`id`,
								`durability`,
								`amount`,
								`resource_type_id` ,
								)
								VALUES (
								NULL ,  $durability, $amount, $resource_type_id)";
				}
				break;
			case 'update':
				$id = $data['id'];
				$amount = $data['amount'];
				$this->sql = "UPDATE `resources` SET
				`amount` = $amount,
				WHERE `id` = $id";
				break;
			case 'delete':
				$id = $data['id'];
				$this->sql = "DELETE FROM `resources` r
				WHERE r.id = $id";
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `resources`";
				break;
			default:
				$this->sql = "SELECT * FROM `resources` r
				INNER JOIN `resource_type` rt ON r.resource_type_id = rt.id";
				break;
		}

		return $this->sql;
	}
} 