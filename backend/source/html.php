<?php

/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 11.12.13
 * Time: 09:04
 */

class html
{

	public function head($title)
	{
		echo "
		<!DOCTYPE html>
		<html>
		<head>
		<link rel='stylesheet' type='text / css' href=' ../../../simulation/data/library/Jquery_Ui/css/dot-luv/jquery-ui-1.10.3.custom.css'>
		<link rel='stylesheet' type='text / css' href=' ../../../simulation/data/library/Bootstrap/dist/css/bootstrap.min.css'>
		<link rel='stylesheet' type='text / css' href=' ../../../simulation/data/library/Jscrollpane/jquery.jscrollpane.css'>
		<link rel='stylesheet' type='text / css' href=' ../../../simulation/data/css/main.css'>
		<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-1.9.1.js'></script>
		<script src=' ../../../simulation/data/library/Jquery/jquery.min.js'></script>
		<script src=' ../../../simulation/data/library/Jscrollpane/jquery.jscrollpane.min.js'></script>
		<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-ui-1.10.3.custom.min.js'></script>
		<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-ui-1.10.3.custom.js'></script>
		<title>$title</title>
		</head>
		<body>
		";
	}

	public function foot()
	{
		echo "
		</body>
		</html>
		";
	}

	public function div($class, $id)
	{
		echo "
		<div class='$class' id='$id'>
		";
	}

	public function div_end()
	{
		echo "
		</div>
		";
	}

	public function button($class, $id, $type, $name)
	{
		echo "
		<button class='$class' id='$id' type='$type'>$name</button>
		";
	}

	public function span($class, $id, $text)
	{
		echo "
		<span class='$class' id='$id'>$text</span>
		";
	}

	public function text($text)
	{
		echo "
		$text
		";
	}

	public function icon($class)
	{
		echo "
		<i class='$class'></i>
		";
	}

	public function image($source, $class, $id, $alt, $height, $width)
	{
		echo "
		<img src='../../data/image/$source' class='$class' id='$id' alt='$alt' height='$height' width='$width'>
		";
	}

	public function iframe($source, $class, $id, $height, $width, $name){
		echo"
		<iframe src='../../frontend/site/$source' class='$class' id='$id' height='$height' width='$width' name='$name' scrolling='no' >
		Ihr Browser unterstützt leider keine Iframes!
		</iframe>
		";
	}

	public function form($class, $id, $action, $target, $role)
	{
		echo "
		<form class='$class' id='$id' action='$action' target='$target' role='$role' method='post'>
		";
	}

	public function form_end()
	{
		echo "

		";
	}

	public function ulist($class, $id){
		echo "
		<ul class='$class' id='$id'>
		";
	}

	public function ulist_end(){
		echo "
		</ul>
		";
	}

	public function olist($class, $id){
		echo "
		<ol class='$class' id='$id'>
		";
	}

	public function olist_end(){
		echo "
		</ol>
		";
	}

	public function list_element($class, $id){
		echo "
		<li class='' id=''>
		";
	}

	public function list_element_end(){
		echo "
		</li>
		";
	}

	public function link($source, $class, $id){
		echo "
		<a href='$source' class='$class' id='$id'>
		";
	}

	public function link_end(){
		echo "
		</a>
		";
	}

	public function input($class, $id, $type, $name){
		echo "
		<input class='$class' id='$id' type='$type' name='$name'>
		";
	}

	public function bar($class, $now, $min, $max){
		echo"
		<div class='progress-bar progress-bar-$class' role='progressbar' aria-valuenow='$now' aria-valuemin='$min' aria-valuemax='$max' style='width: $now%'>
		";
	}

	public function h($number, $text){
		echo"
		<h$number>$text</h$number>
		";
	}

	public function p($text){
		echo "
		<p>
		$text
		</p>
		";
	}

	public function br(){
		echo "
		</br>
		";
	}
}