<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 17.12.13
 * Time: 12:21
 */

class session
{

	public function start()
	{
		session_set_cookie_params(600,"/");
		session_start();
	}

	public function destroy()
	{
		session_destroy();
	}

	public function set($name, $value)
	{
    	$_SESSION[$name] = $value;
	}

	public function load($name)
	{
		if(!empty($_SESSION[$name])){
			$name = $_SESSION[$name];
		}else{
			echo("$name ist nicht gesetzt");
		}
	}
} 