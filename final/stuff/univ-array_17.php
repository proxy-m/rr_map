<?php
date_default_timezone_set('UTC');
$db           = new PDO('sqlite:raundrank.sqlite');
$sql          = 'SELECT [Univ name]  FROM Univ WHERE 1 ORDER BY [Univ name];';
//echo $sql;
$st           = $db->prepare($sql);
$st->execute();
$rr           = $st->fetchAll();
$universities = array();
$i=0;

foreach($rr as $row)
{
	$i++;$universities[$i] = $row['Univ name'];
}
header('Content-Type: application/json');
echo json_encode( $universities );