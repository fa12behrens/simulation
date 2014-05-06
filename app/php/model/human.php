<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 26.04.14
 * Time: 23:05
 */
class human
{

	private $sql;

	public function getSql($type, $data = null)
	{
		switch ($type) {
			case 'load':
				$this->sql = "SELECT * FROM `human` h
				INNER JOIN `human_type` ht ON h.human_type_id = ht.id";
				break;
			case 'create':
				$name = $data[0];
				$gender = $data[1];
				$human_type_id = $data[2];
				if ($data !== null) {
					$this->sql = "INSERT INTO  `simulator`.`human` (
								`id`,
								`name`,
								`gender`,
								`human_type_id`
								)
								VALUES (
								NULL ,  '$name', '$gender', $human_type_id)";
				}
				break;
			case 'delete':
				$id = $data;
				$this->sql = "DELETE FROM `human`
				WHERE id = $id";
				break;
			case 'truncate':
				$this->sql = "TRUNCATE `human`";
				break;
			default:
				$this->sql = "SELECT * FROM `human` h
				INNER JOIN `human_type` ht ON h.human_type_id = ht.id";
				break;
		}

		return $this->sql;
	}
} 