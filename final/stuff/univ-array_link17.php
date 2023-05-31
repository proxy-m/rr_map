<?php
date_default_timezone_set('UTC');
$univ = isset($_REQUEST['univ'])?$_REQUEST['univ']: 'Aalto University';
$univ = str_replace("!", "&", $univ);
//echo $univ;
$db           = new PDO('sqlite:raundrank.sqlite');
$sql          = 'SELECT nm_page,isindex FROM Univ WHERE [Univ name]="'.$univ.'";';
//echo $sql;
$st=$db->prepare($sql);
$st->execute();
$rr=$st->fetchAll();
$universities = [];

foreach($rr as $row)
{
	$universities['aliase'] = $row['nm_page'];
	$universities['isindex'] = $row['isindex'];
}
header('Content-Type: application/json');
echo json_encode( $universities );