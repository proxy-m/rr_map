<?php
	$year = isset($_REQUEST['year'])?$_REQUEST['year']: 2017;
	$subj = isset($_REQUEST['subj'])?$_REQUEST['subj']: 'Overall';
	$unnm = isset($_REQUEST['unnm'])?$_REQUEST['unnm']: 'Aalto University';
	$unnmn=urldecode($unnm);
	$subj=urldecode($subj);
//	echo $unnmn;
	$db = new PDO('sqlite:raundrank.sqlite');
	$sql='SELECT t1.O_WR as O_WR FROM rur AS t1 JOIN year AS t2 ON t1.id_year = t2.id_year JOIN Subject AS t3 ON t1.id_subj = t3.id_subj JOIN Univ AS t4 ON t1.id_univ = t4.id_univ WHERE t2.year ='.$year.' AND t3.subject = '.$subj.' AND t4.[Univ name] = '.$unnmn.' LIMIT 1;';
//echo $sql;
	$st = $db->prepare($sql);
	$st->execute();	
	$rr = $st->fetchAll();
	$owr=0;
	foreach ($rr as $row)
	{
		$owr = $row['O_WR'];
	}
//	echo '<BR>'.$owr;
	header('Content-Type: application/json');
	echo json_encode( $owr);
?>