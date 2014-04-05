<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 16.12.13
 * Time: 11:43
 */

require_once('../../backend/source/html.php');
require_once('../../backend/source/js.php');

class ajax
{

	public function handle()
	{

		$html = new html();
		$js = new js();
		$js->ajax('#ajax', 'index', '#input', 'refresh');
		$html->input('btn btn-default', 'index', 'submit', 'NAME');
		$html->input('', 'input', 'text', 'NAME');
		$html->div('', 'output');
		$html->div_end();
		echo '<div class="refresh">';
		if (!empty($_POST['name'])) {
			$ret = $_POST['name'];
			$handle = fopen("file.txt", "w+");
			fwrite($handle, $ret);
			fclose($handle);
		} else {
			echo "fail";
			$d = new DateTime();
			echo $d->format('i');
		}
		echo '</div>';
	}
}