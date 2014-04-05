<!DOCTYPE html>
<html>
<head>
	<link rel='stylesheet' type='text / css'
		  href=' ../../../simulation/data/library/Jquery_Ui/css/dot-luv/jquery-ui-1.10.3.custom.css'>
	<link rel='stylesheet' type='text / css'
		  href=' ../../../simulation/data/library/Bootstrap/dist/css/bootstrap.min.css'>
	<link rel='stylesheet' type='text / css'
		  href=' ../../../simulation/data/library/Jscrollpane/jquery.jscrollpane.css'>
	<link rel='stylesheet' type='text / css' href=' ../../../simulation/data/css/main.css'>
	<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-1.9.1.js'></script>
	<script src=' ../../../simulation/data/library/Jquery/jquery.min.js'></script>
	<script src=' ../../../simulation/data/library/Jscrollpane/jquery.jscrollpane.min.js'></script>
	<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-ui-1.10.3.custom.min.js'></script>
	<script src=' ../../../simulation/data/library/Jquery_Ui/js/jquery-ui-1.10.3.custom.js'></script>
	<title>Restaurant Simulation</title>
</head>
<body>

<div class='container' id='1'>

<div class='row' id='11'>

</div>

<div class='row special' id='12'>

	<div class='col-md-12' id='121'>

		<h1>Restaurant Simulation</h1>

	</div>

</div>

<div class='row' id='13'>

</div>

<div class='row main' id='14'>

	<div class='col-md-3' id='141'>

		<script>
			$(document).ready(function () {
				$('.accordion').accordion();
			});
		</script>

		<div class='accordion' id='accordion'>

			<h3>stock</h3>

			<div class='acco' id='stock'>

				<img src='../../data/image/jinx.jpg' class='img-thumbnail' alt='Jinx' height='90px' width='60px'>

				awesome text

			</div>

			<h3>calendar</h3>

			<div class='acco' id='calendar'>

				<img src='../../data/image/jinx.jpg' class='img-thumbnail' alt='Jinx' height='90px' width='60px'>

				awesome text

			</div>

			<h3>todo</h3>

			<div class='acco' id='todo'>

				<img src='../../data/image/jinx.jpg' class='img-thumbnail' alt='Jinx' height='90px' width='60px'>

				awesome text

			</div>

			<h3>master</h3>

			<div class='acco' id='master'>

				<img src='../../data/image/jinx.jpg' class='img-thumbnail' alt='Jinx' height='90px' width='60px'>

				awesome text

			</div>

		</div>

	</div>

	<div class='col-md-9' id='143'>

		<script>
			$(document).ready(function () {
				$('.tab').tabs();
			});
		</script>

		<div class='tab' id='tab'>

			<ul class=''>

				<li class=''>

					<a href='#overview' class=''>

						<span class=''>overview</span>

					</a>

				</li>

				<li class=''>

					<a href='#change' class=''>

						<span class=''>change</span>

					</a>

				</li>

				<li class=''>

					<a href='#options' class=''>

						<span class='' id=''>options</span>

					</a>

				</li>

			</ul>

			<div class='' id='overview'>

				view your X

			</div>

			<div class='' id='change'>

				change your X

			</div>

			<div class='' id='options'>

				change your options

			</div>

			<script type='text/javascript'>
				$(document).ready(function () {
					$('#ajax').click(function () {
						var name = encodeURI($('#input').val());
						if (name == '') {
							//alert('Bitte einen Namen angeben!');
						} else {
							//alert(name);
							$.post('index.php',
								{
									name: name
								},
								function (data, status) {
								//alert('Data: ' + name);
								});
							$('.refresh').load(window.location.pathname+' .refresh');
						}
					});
				});
			</script>

			<input class='btn btn-default' id='ajax' type='submit' name='NAME'>

			<input class='' id='input' type='text' name='NAME'>

			<div class='' id='output'>

			</div>
			<div class="refresh">
				<?php
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
				?>
			</div>
		</div>

	</div>

</div>

<div class='row' id='15'>

</div>

<div class='row special' id='16'>

	<div class='col-md-10' id='163'>

		droggelbecher

	</div>

</div>

<div class='row' id='17'>

</div>

</div>

</body>
</html>
		