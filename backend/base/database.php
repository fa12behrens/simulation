<?php
/**
 * Created by PhpStorm.
 * User: T.Behrens
 * Date: 17.12.13
 * Time: 12:20
 */

class database
{

	public function query($query)
	{
		$mysql_host = 0;
		$mysql_user = 0;
		$mysql_password = 0;
		$mysql_dbname = 0;

		$link = mysql_connect($mysql_host, $mysql_user, $mysql_password);

		if (!$link = mysql_connect($mysql_host, $mysql_user, $mysql_password)) {
			echo 'Keine Verbindung zu mysql';
			exit;
		}

		if (!mysql_select_db($mysql_dbname, $link)) {
			echo 'Konnte Schema nicht selektieren';
			exit;
		}

		$sql = $query;
		$result = mysql_query($sql, $link);

		if (!$result) {
			echo "DB Fehler, konnte die Datenbank nicht abfragen\n";
			echo 'MySQL Error: ' . mysql_error();
			exit;
		}

		while ($row = mysql_fetch_assoc($result)) {
			echo $row['foo'];
		}

		return mysql_free_result($result);
	}
} 