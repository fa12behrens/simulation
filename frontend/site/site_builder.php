<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 08:39
 */

require_once('../../backend/source/html.php');
require_once('../component/header.php');
require_once('../component/navigation.php');
require_once('../component/vessel.php');
require_once('../component/footer.php');

class site_builder {

	public function build($title){
		$html = new html();

		$html->head($title);
			$html->div('container','1');
				$html->div('row','11');
				$html->div_end();
				$html->div('row special','12');
					$head = new header();
					$head->build();
				$html->div_end();
				$html->div('row','13');
				$html->div_end();
				$html->div('row main','14');
					$nav = new navigation();
					$nav->build();
					$vessel = new vessel();
					$vessel->build();
				$html->div_end();
				$html->div('row','15');
				$html->div_end();
				$html->div('row special','16');
					$foot = new footer();
					$foot->build();
				$html->div_end();
				$html->div('row','17');
				$html->div_end();
			$html->div_end();
		$html->foot();
	}
} 