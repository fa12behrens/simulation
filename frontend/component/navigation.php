<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 08:40
 */

require_once('../../backend/source/html.php');
require_once('../part/single_nav.php');

class navigation
{

	public function build()
	{
		$html = new html();
		$single = new single_nav();

		$html->div('col-md-3', '141');
			$single->build();
		$html->div_end();
	}
}