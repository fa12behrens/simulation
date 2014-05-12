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
			case 'truncate':
				$this->sql = "TRUNCATE `product_type`";
				break;
		}

		return $this->sql;
	}
} 