<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 27.04.14
 * Time: 17:14
 */

class human_type {
	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `human_type` ht
				INNER JOIN `human` h ON h.human_type_id = ht.id";
				break;
			default:
				$this->sql = "SELECT * FROM `human_type` ht
				INNER JOIN `human` h ON h.human_type_id = ht.id";
				break;
		}

		return $this->sql;
	}
} 