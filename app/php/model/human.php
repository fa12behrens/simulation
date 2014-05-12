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
				$this->sql = "SELECT h.id, h.name, h.gender, ht.type, hho.order_id, o.order_product_type_id, o.ordered, p.creation_time, p.product_type_id,
				pt.ingredients, pt.time_to_cold, pt.price, hhp.product_id
   				FROM `human` h
			 	INNER JOIN `human_type` ht ON h.human_type_id = ht.id
				LEFT JOIN `human_has_order` hho ON h.id = hho.human_id
				LEFT JOIN `order` o ON hho.order_id = o.id
				LEFT JOIN `human_has_product` hhp ON h.id = hhp.human_id
				LEFT JOIN `product` p ON hhp.product_id = p.id
				LEFT JOIN `product_type` pt ON p.product_type_id = pt.id
				GROUP BY h.id";
				break;
			case 'loadLast':
				$this->sql = "SELECT h.id, h.name, h.gender, ht.type, hho.order_id, o.order_product_type_id, o.ordered, p.creation_time, p.product_type_id,
				pt.ingredients, pt.time_to_cold, pt.price, hhp.product_id
   				FROM `human` h
			 	INNER JOIN `human_type` ht ON h.human_type_id = ht.id
				LEFT JOIN `human_has_order` hho ON h.id = hho.human_id
				LEFT JOIN `order` o ON hho.order_id = o.id
				LEFT JOIN `human_has_product` hhp ON h.id = hhp.human_id
				LEFT JOIN `product` p ON hhp.product_id = p.id
				LEFT JOIN `product_type` pt ON p.product_type_id = pt.id
				ORDER BY
        		h.id DESC
  				LIMIT
        		1";
				break;
			case 'loadById':
				$this->sql = "SELECT h.id, h.name, h.gender, ht.type, hho.order_id, o.order_product_type_id, o.ordered, p.creation_time, p.product_type_id,
				pt.ingredients, pt.time_to_cold, pt.price, hhp.product_id
				FROM `human` h
				INNER JOIN `human_type` ht ON h.human_type_id = ht.id
				LEFT JOIN `human_has_order` hho ON h.id = hho.human_id
				LEFT JOIN `order` o ON hho.order_id = o.id
				LEFT JOIN `human_has_product` hhp ON h.id = hhp.human_id
				LEFT JOIN `product` p ON hhp.product_id = p.id
				LEFT JOIN `product_type` pt ON p.product_type_id = pt.id
				WHERE h.id = $data
				GROUP BY h.id";
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
		}

		return $this->sql;
	}
} 