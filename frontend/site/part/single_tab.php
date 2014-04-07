<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 13.12.13
 * Time: 13:10
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');
require_once('../part/ajax.php');

class single_tab {

	public function build(){

		$html = new html();
		$js = new js();
		$tabs = array('overview'=>'view your X','change'=>'change your X','options'=>'change your options');

		$js->tab('.tab');
		$html->div('tab','tab');
			$html->ulist('','');
			foreach($tabs as $key=>$tab){
				$html->list_element('','');
				$html->link("#$key",'','');
				$html->span('','',"$key");
				$html->link_end();
				$html->list_element_end();
			}
			$html->ulist_end();
			foreach($tabs as $key=>$tab){
				$html->div('',"$key");
				$html->text("$tab");
				$html->div_end();
			}
		$ajax = new ajax();
		$ajax->handle();
		$html->div_end();
	}

} 