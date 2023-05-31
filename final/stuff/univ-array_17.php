<?php

	date_default_timezone_set('UTC');
	$year = intval($_GET['year']) > 0 ? intval($_GET['year']) : '2016';
	$subject = ($_GET['subject']) ?($_GET['subject']) : 'Overall';
	$db   =  new PDO('sqlite:raundrank.sqlite');
	
	//$sql = 'SELECT DISTINCT `rowid`, `Univ name` FROM `rur` WHERE `active` = 1 AND Subject ="Overall"';// Order by "Univ name"';
	//$sql = 'SELECT  `rowid`, `Univ name` FROM `rur` WHERE year =:year AND subject=:subject Order by `Univ name`';// AND Subject =`Overall`';// ';
	$sql ='SELECT DISTINCT t2.[Univ name] FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN year AS t3 ON t1.id_year = t3.id_year       JOIN Subject AS t4 ON t1.id_subj = t4.id_subj WHERE t3.year ='.$year.' AND t4.subject ="'.$subject.'" ORDER BY t1.id_univ;';
//	echo $sql;
	$st = $db->prepare($sql);
//	$st->bindParam(':year', $year, PDO::PARAM_STR, 4);
//	$st->bindParam(':subject', $subject, PDO::PARAM_STR, 50);
	$st->execute();	
	$rr = $st->fetchAll();

	$universities = array();
	foreach ($rr as $row)
	{
		$universities[] = $row['Univ name'];
	}

	header('Content-Type: application/json');
	echo json_encode( $universities );