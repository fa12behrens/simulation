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
			case 'truncate':
				$this->sql = "TRUNCATE `resource_type`";
				break;
		}

		return $this->sql;
	}
} 