<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 08:40
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');

class header
{

	public function build()
	{
		$html = new html();
		$js = new js();

		$html->div('col-md-12', '121');
		$html->h('1','WG Manager');
		$html->div_end();
	}
}