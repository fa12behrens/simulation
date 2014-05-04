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
				$this->sql = "SELECT * FROM `resource_type` rt
				INNER JOIN `resources` r ON r.resource_type_id = rt.id";
				break;
			default:
				$this->sql = "SELECT * FROM `resource_type` rt
				INNER JOIN `resources` r ON r.resource_type_id = rt.id";
				break;
		}

		return $this->sql;
	}
} 