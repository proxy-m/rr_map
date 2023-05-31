<?php
date_default_timezone_set('UTC');
$year = isset($_REQUEST['year'])?$_REQUEST['year']: 2017;
$subject = isset($_REQUEST['subj']) ?($_REQUEST['subj']) : 'Overall';
$db           = new PDO('sqlite:raundrank.sqlite');
$sql          = 'SELECT DISTINCT t1.id_univ,t2.[Univ name] FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN year AS t3 ON t1.id_year = t3.id_year JOIN Subject AS t4 ON t1.id_subj = t4.id_subj WHERE t3.year ='.$year.' AND t4.subject ="'.$subject.'" ORDER BY t1.id_univ;';
//echo $sql;
$st           = $db->prepare($sql);
$st->execute();
$rr           = $st->fetchAll();
$universities = array();
foreach($rr as $row)
{
	$universities[$row['id_univ']] = $row['Univ name'];
}
header('Content-Type: application/json');
echo json_encode( $universities );