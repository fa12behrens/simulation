<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 09.01.14
 * Time: 15:37
 */

require_once('../../backend/base/session.php');

class log
{

	public function login($user, $password)
	{
		//load out of db
		$db_user = '';
		$db_password = '';
		$password = md5($password);
		if ($user == $db_user && $password == $db_password) {
			//save in database
			$session = new session();
			$session->start();
			$session->set('user', $user);
		} else{
			echo"falsch eingegeben";
		}
	}

	public function logout()
	{
		$session = new session();
		$session->destroy();
	}

	public function registration($user, $password, $confirmation, $key)
	{
		//load out of db
		$db_all_user = '';
		$db_key = '';
		if ($password != $confirmation) {
			echo "falsch wiederholt";

			return false;
		}
		$password = md5($password);
		if ($key == $db_key && !in_array($user, $db_all_user)) {
			//save in database
			$session = new session();
			$session->start();
			$session->set('user', $user);
		} else {
			echo "falscher key";

			return false;
		}
	}

} 