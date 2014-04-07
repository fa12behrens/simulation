<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 08:40
 */

require_once('../../backend/source/html.php');
require_once('../part/single_tab.php');

class vessel
{

	public function build()
	{
		$html = new html();
		$single = new single_tab();

		$html->div('col-md-9', '143');
			$single->build();
		$html->div_end();
	}
}