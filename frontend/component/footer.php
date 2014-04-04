<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 08:40
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');

class footer
{

	public function build()
	{
		$html = new html();
		$js = new js();

		$html->div('col-md-10', '163');
		$html->text('droggelbecher');
		$html->div_end();
	}
}