<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 12:57
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');

class single_nav {

	public function build()
	{
		$html = new html();
		$js = new js();
		$accordions = array('stock'=>'awesome text','calendar'=>'awesome text','todo'=>'awesome text','master'=>'awesome text');

		$js->accordion('.accordion');
		$html->div('accordion','accordion');
			foreach($accordions as $key=>$accordion){
				$html->h('3',"$key");
				$html->div('acco',"$key");
					$html->image('jinx.jpg','img-thumbnail','','Jinx', '90px', '60px');
					$html->text($accordion);
				$html->div_end();
			};
		$html->div_end();
	}
} 