<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 07.05.14
 * Time: 10:51
 */

class order {
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'loadByType':
				$this->sql = "SELECT * FROM `order`
				WHERE order_product_type_id = $data
				ORDER BY
        		`id` DESC
  				LIMIT
        		1";
				break;
			case 'create':
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`order` (
								`id`,
								`order_product_type_id`,
								`ordered`
								)
								VALUES (
								null, $data, null)";
				}
				break;
			case 'update':
				$id = $data[0];
				$status = $data[1];
				if ($data !== null) {
					$this->sql = "UPDATE  `simulator`.`order`
								SET `ordered` = $status
								WHERE id = $id";
				}
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `order`";
				break;
		}

		return $this->sql;
	}
} 