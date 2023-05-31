<?php
	$mt = microtime();
	$table = isset($_REQUEST['t'])?$_REQUEST['t']: 't2017';
	$year = trim(str_ireplace('t','',$table));
	$rank = isset($_REQUEST['r'])?$_REQUEST['r']: 'O_WR';
	$s = isset($_REQUEST['s'])?$_REQUEST['s']: 'O';
	$sa = isset($_REQUEST['sa'])?$_REQUEST['sa']: 'SO';
	$sc = isset($_REQUEST['sc'])?$_REQUEST['sc']: 'All Countries';
//	echo('<script type="text/javascript"> alert("'.$sc.'");</script>');
	$sort2col = array(
		'O' => array(
			'rank' => 'O_WR',
			'score' => 'O_WS',
			'legacy' => 'O_OL'
		), 
		'T' => array(
			'rank' => 'O_TR',
			'score' => 'O_TS',
			'legacy' => 'O_TL'
		), 
		'R' => array(
			'rank' => 'O_RR',
			'score' => 'O_RS',
			'legacy' => 'O_RL'
		), 
		'I' => array(
			'rank' => 'O_IR',
			'score' => 'O_IS',
			'legacy' => 'O_IL'
		), 
		'F' => array(
			'rank' => 'O_FR',
			'score' => 'O_FS',
			'legacy' => 'O_FL'
		), 
	);
	
	$subject2col = array (	
		'SO' => 'Overall',
		'SE' => 'Technical Sciences',
		'SH' => 'Humanities',
		'SL' => 'Life Sciences',
		'SM' => 'Medical Sciences',
		'SN' => 'Natural Sciences',
		'SS' => 'Social Sciences'
	);
	
	$rank = $sort2col[$s]['rank'];
	$score = $sort2col[$s]['score'];
	$legacy = $sort2col[$s]['legacy'];
	
	$subject = $subject2col[$sa];
	
	//echo($rank.'<br>'.$score.'<br>'.$legacy.'<br>'.$subject.'<br>'.$sc.'<br>');
	
	$table = str_replace('#','',$table);
	
	function db(){ 
		$db = new PDO('sqlite:raundrank.sqlite');
		return $db;
	}
	
	$db = db();
	
	if($sc=='All Countries')
	{
		$sql = 'SELECT t9.[Univ name],t9.nm_page,t10.Country AS Economy,t10.Flag,t10.Region,t2.year,t3.subject,t1.O_WR,t1.O_WS,t4.League AS O_OL,t1.O_TR,t1.O_TS,t5.League AS O_TL,t1.O_RR,t1.O_RS,t6.League AS O_RL,t1.O_IR,t1.O_IS,t7.League AS O_IL,t1.O_FR,t1.O_FS,t7.League AS O_FL   FROM rur AS t1 JOIN year AS t2 ON t1.id_year = t2.id_year JOIN subject AS t3 ON t1.id_subj = t3.id_subj JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN Univ AS t9 ON t1.id_univ = t9.id_univ  JOIN Country AS t10 ON t9.id_country = t10.id_country  WHERE t2.year = :year AND t3.subject = :subject  ORDER BY '.$rank.',t9.[Univ name] + 0;';
	$st = $db->prepare($sql);	
	$st->bindParam(':year', $year, PDO::PARAM_STR, 4);
	$st->bindParam(':subject', $subject, PDO::PARAM_STR);
	$st->execute();	
	}
	else
	{
	$sql = 'SELECT t9.[Univ name],t9.nm_page,t10.Country AS Economy,t10.Flag,t10.Region,t2.year,t3.subject,t1.O_WR,t1.O_WS,t4.League AS O_OL,t1.O_TR,t1.O_TS,t5.League AS O_TL,t1.O_RR,t1.O_RS,t6.League AS O_RL,t1.O_IR,t1.O_IS,t7.League AS O_IL,t1.O_FR,t1.O_FS,t7.League AS O_FL   FROM rur AS t1 JOIN year AS t2 ON t1.id_year = t2.id_year JOIN subject AS t3 ON t1.id_subj = t3.id_subj JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN Univ AS t9 ON t1.id_univ = t9.id_univ  JOIN Country AS t10 ON t9.id_country = t10.id_country  WHERE t2.year = :year AND t3.subject = :subject AND t10.Country=:cntr  ORDER BY '.$rank.',t9.[Univ name] + 0;';
	$st = $db->prepare($sql);	
	$st->bindParam(':year', $year, PDO::PARAM_STR, 4);
	$st->bindParam(':subject', $subject, PDO::PARAM_STR);
	$st->bindParam(':cntr', $sc, PDO::PARAM_STR);
	$st->execute();
	}

	$rows = $st->fetchAll(PDO::FETCH_ASSOC);
	
	$i = 0;
	$rr = array();
	foreach ($rows as $row){
		$i++;
		$className = ' az-row-'.((int)(($i) / 100)*100+100);
	//echo $className.'<br>';	
		if ($row[$rank]>0){

			$r = array(
//				'i' 		   => $row['O_WR'],
				'i'			   => $row[$sort2col[$s]['rank']],
				'economy'      => $row['Economy'],
				'univ'         => $row['Univ name'],
				'univ_encoded' => urlencode($row['Univ name']),
				//'flag'         => '/images/flag/flag-'.str_replace(' ','-',strtolower($row['Economy'])).'.png',
				'flag'         => $row['Flag'],
				'rank'         => $row[$rank],
				'league'       => $row[$legacy],
				'score'        => $row[$score],
				'region'       => $row['Region'],
				'class'        => $className,
				'nm_page'	   => $row['nm_page'],
			);
			$rr[] = $r;
		}
		
	}
	//'score'        => number_format($row[$score], 3, '.', '')
	

	
	function out_json($arr){
		header('Content-Type: application/json');
		echo json_encode( $arr );
	}
	
	out_json($rr);