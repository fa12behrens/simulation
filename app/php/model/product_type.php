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
				$this->sql = "SELECT * FROM `product_type` pt
				INNER JOIN `product` p ON p.product_type_id = pt.id";
				break;
			default:
				$this->sql = "SELECT * FROM `product_type` pt
				INNER JOIN `product` p ON p.product_type_id = pt.id";
				break;
		}

		return $this->sql;
	}
} 