<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 04.05.14
 * Time: 12:05
 */

class resource_type {
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT r.id, r.durability, r.amount, r.resource_type_id, rt.type, rt.purchase_price FROM `resources` r
				INNER JOIN `resource_type` rt ON r.resource_type_id = rt.id";
				break;
			case 'loadById':
				$this->sql = "SELECT * FROM `resource_type` rt
				WHERE id = $data";
				break;
			case 'create':
				$durability = $data[0];
				$amount = $data[1];
				$resource_type_id = $data[2];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`human_has_order` (
								`id`,
								`durability`,
								`amount`,
								`resource_type_id`
								)
								VALUES (
								NULL , $durability, $amount, $resource_type_id)";
				}
				break;
			case 'update':
				$id = $data[0];
				$amount = $data[1];
				if ($data !== null) {
					$this->sql = "UPDATE  `simulator`.`resources`
								SET `ordered` = $amount
								WHERE id = $id";
				}
				break;
			case 'delete':
				$id = $data;
				$this->sql = "DELETE FROM `resources`
				WHERE id = $id";
				break;
			case 'deleteExpired':
				$current_date = $data;
				$this->sql = "DELETE FROM `resources`
				WHERE durability < '$current_date'";
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `resources`";
				break;
			default:
				$this->sql = "SELECT r.id, r.durability, r.amount, r.resource_type_id, rt.type, rt.purchase_price FROM `resources` r
				INNER JOIN `resource_type` rt ON r.resource_type_id = rt.id";
				break;
		}

		return $this->sql;
	}
} 