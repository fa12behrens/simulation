<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 04.05.14
 * Time: 14:28
 */
class product
{
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `product` p
				INNER JOIN `product_type` pt ON p.product_type_id = pt.id";
				break;
			case 'loadByType':
				$this->sql = "SELECT * FROM `product`
				WHERE product_type_id = $data
				ORDER BY
        		`id` DESC
  				LIMIT
        		1";
				break;
			case 'create':
				$product_type_id = $data;
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`product` (
								`id`,
								`creation_time`,
								`product_type_id`
								)
								VALUES (
								NULL , NULL, $product_type_id)";
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