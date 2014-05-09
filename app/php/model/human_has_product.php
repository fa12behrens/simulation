<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 08.05.14
 * Time: 11:22
 */
class human_has_product
{
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'loadOneById':
				$this->sql = "SELECT * FROM `human_has_product`
							WHERE human_id = $data
							LIMIT 1";
				break;
			case 'create':
				$human_id = $data[0];
				$product_id = $data[1];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`human_has_product` (
								`human_id`,
								`product_id`
								)
								VALUES (
								$human_id, $product_id)";
				}
				break;
			case 'delete':
				$human_id = $data[0];
				$product_id = $data[1];
				$this->sql = "DELETE FROM `human_has_product`
				WHERE human_id = $human_id AND product_id = $product_id";
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