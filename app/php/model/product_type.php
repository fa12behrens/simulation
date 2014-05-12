<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 04.05.14
 * Time: 17:15
 */

class product_type {
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `product_type`";
				break;
			case 'loadById':
				$this->sql = "SELECT * FROM `product_type`
				WHERE id = $data";
				break;
			case 'create':
				$creation_time = $data['creation_time'];
				$product_type_id = $data['product_type_id'];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`resources` (
								`id`,
								`creation_time`,
								`product_type_id` ,
								)
								VALUES (
								NULL , $creation_time, $product_type_id)";
				}
				break;
			case 'delete':
				$id = $data['id'];
				$this->sql = "DELETE FROM `product` p
				WHERE p.id = $id";
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `product`";
				break;
			default:
				$this->sql = "SELECT * FROM `product` p
				INNER JOIN `product_type` pt ON p.product_type_id = pt.id";
				break;
		}

		return $this->sql;
	}
} 