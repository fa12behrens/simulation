<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 16.12.13
 * Time: 11:43
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');

class ajax {

	public function handle(){

		$html = new html();
		$js = new js();
		$js->ajax('#ajax','ajax','#input','#output');
		$html->input('btn btn-default','ajax','submit','NAME');
		$html->input('','input','text','NAME');
		$html->div('','output');
		$html->div_end();

		if(!empty($_POST['name'])){
			$ret = Array("hello" => "Hallo ".$_POST['name'], "ip" => $_SERVER['REMOTE_ADDR'] );
			echo"win";
			echo json_encode($ret);
		}
		else{
			echo"fail";
		}
	}
}