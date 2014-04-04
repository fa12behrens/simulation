<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 17.12.13
 * Time: 12:20
 */

class xml {

	public function load($file){
		simplexml_load_file("../../data/xml/$file");
	}
} 