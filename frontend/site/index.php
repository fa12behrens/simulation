<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 11.12.13
 * Time: 10:36
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');
require_once('site_builder.php');

class index extends site_builder
{

	public function execute(){
		$display = new site_builder();
		$display->build('WG Manager');
	}
}

$start = new index();
$start->execute();