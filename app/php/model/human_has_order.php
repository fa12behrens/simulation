<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 07.05.14
 * Time: 15:34
 */

class human_has_order {
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `product` p
				INNER JOIN `product_type` pt ON p.product_type_id = pt.id";
				break;
			case 'create':
				$human_id = $data[0];
				$order_id = $data[1];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`human_has_order` (
								`human_id`,
								`order_id`
								)
								VALUES (
								$human_id, $order_id)";
				}
				break;
			case 'delete':
				$human_id = $data[0];
				$order_id = $data[1];
				$this->sql = "DELETE FROM `human_has_order`
				WHERE human_id = $human_id AND order_id = $order_id";
				break;
			case 'deleteByHuman':
				$this->sql = "DELETE FROM `human_has_order`
				WHERE human_id = $data
				ORDER BY human_id
				Limit 1";
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `product`";
				break;
		}

		return $this->sql;
	}
} 