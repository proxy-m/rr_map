<?php
session_start();

define('DEBUG', false); // флаг разработки / debug dev flag

if (DEBUG){
	error_reporting(E_ERROR | E_WARNING | E_STRICT | E_NOTICE | E_PARSE); // error_reporting( E_ALL | E_STRICT );
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	ini_set('ignore_repeated_errors', 0);
	ini_set('html_errors', 1);
	ini_set('log_errors', 1);
} else {
	error_reporting(E_ALL & ~E_WARNING & ~E_STRICT & ~E_NOTICE & ~E_PARSE);
	ini_set('display_errors', 0);
	ini_set('display_startup_errors', 0);
	ini_set('ignore_repeated_errors', 1);
	ini_set('html_errors', 0);
	ini_set('log_errors', 1);
}


if($_REQUEST['year']!=''){$year =$_REQUEST['year'];}else{$year =12;}
if($_REQUEST['subj']!=''){$subj =$_REQUEST['subj'];}else{$subj =1;}
if($_REQUEST['cntr']!=''){$cntr =$_REQUEST['cntr'];}else{$cntr =0;}
//$cntr =3;
if($_REQUEST['reg']!=''){$reg =$_REQUEST['reg'];}else{$reg =0;}
//$reg =3;
$sb=[];
$sb[1]='SO';$sb[2]='SH';$sb[3]='SL';$sb[4]='SM';$sb[5]='SN';$sb[6]='SS';$sb[7]='SE';
$univ = [];$i=0;$country=[];$infomap=[];
//echo $year.' '.$subj.' '.$cntr.' '.$reg.'<br>';
$db   =  new PDO('sqlite:raundrank.sqlite');

	if($cntr !=0)
	{$sqlc='SELECT DISTINCT t1.id_country,t1.Country,t1.cord,t1.scale,t1.cntr_code,t1.cntr_iso,t1.code_cntr,t1.code_reg FROM Country AS t1 JOIN Univ AS t2 ON t1.id_country = t2.id_country JOIN rur AS t3 ON t2.id_univ = t3.id_univ WHERE t3.id_year = '.$year.' AND t3.id_subj = '.$subj.' AND t1.id_country= '.$cntr.';';}
	else{
	if($reg !=0){$sqlc='SELECT DISTINCT t1.id_country,t1.Country,t1.cord,t1.scale,t1.cntr_code,t1.cntr_iso,t1.code_cntr,t1.code_reg FROM Country AS t1 JOIN Univ AS t2 ON t1.id_country = t2.id_country JOIN rur AS t3 ON t2.id_univ = t3.id_univ WHERE t3.id_year = '.$year.' AND t3.id_subj = '.$subj.' AND t1.id_reg= '.$reg.' ORDER BY t1.id_country;';}
	else{$sqlc='SELECT DISTINCT t1.id_country,t1.Country,t1.cord,t1.scale,t1.cntr_code,t1.cntr_iso,t1.code_cntr,t1.code_reg FROM Country AS t1 JOIN Univ AS t2 ON t1.id_country = t2.id_country JOIN rur AS t3 ON t2.id_univ = t3.id_univ WHERE t3.id_year = '.$year.' AND t3.id_subj = '.$subj.' ORDER BY t1.id_country;';}
	}
		//echo $sqlc.'<br>';
		$st = $db->prepare($sqlc);
		$st->execute();	
		$rr = $st->fetchAll();
		$j=0;
		foreach ($rr as $row)
		{
			$j++;
			$rowN = array();
			$rowN['id_country'] = round($row['id_country'],0);
			$rowN['Country'] = $row['Country'];
			$rowN['cord'] = $row['cord'];
			$rowN['scale'] = round($row['scale'],0);
			$rowN['cntr_code'] = $row['cntr_code'];
			$rowN['cntr_iso'] = $row['cntr_iso'];
			$rowN['code_cntr'] = $row['code_cntr'];
			$rowN['code_reg'] = $row['code_reg'];	

			if($_REQUEST['justmap']!='') {
				$country[] = $rowN;
			} else {
				$country[$row['id_country']] = $rowN;
			}
		}
		$c=$j;
		
		if($_REQUEST['justmap']!='') {
			$res = $country;
		} else {
			$res = [$c,$country];
		}
		header('Content-Type: application/json');
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: X-Requested-With');
		echo json_encode($res, true);
		
	?>					
