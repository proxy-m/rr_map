<?php
if($_REQUEST['year']!=''){$year =$_REQUEST['year'];}else{$year =13;}
if($_REQUEST['subj']!=''){$subj =$_REQUEST['subj'];}else{$subj =1;}
if($_REQUEST['cntr']!=''){$cntr =$_REQUEST['cntr'];}else{$cntr =0;}
//$cntr =3;
if($_REQUEST['reg']!=''){$reg =$_REQUEST['reg'];}else{$reg =0;}
//$reg =3;
$univ = [];$i=0;$country=[];
//echo $year.' '.$subj.' '.$cntr.' '.$reg.'<br>';
$db   =  new PDO('sqlite:raundrank.sqlite');
if($cntr==0)
{
	if($reg==0)
	{
		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t1.Faculty,t1.Students,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t1.FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.';';
		//echo $sql.'<br>';
	}
	else
	{
		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t1.Faculty,t1.Students,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t1.FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_reg = '.$reg.';';
	}
}
else
{
$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t1.Faculty,t1.Students,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t1.FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_country = '.$cntr.';';
}	
//echo $sql.'<br>';
	$st = $db->prepare($sql);
	$st->execute();	
	$rr = $st->fetchAll();
	foreach ($rr as $row)
	{
		$i++;
		$univ[$i]['id_univ'] = round($row['id_univ'],0);
		$univ[$i]['univ_name'] = $row['Univ name'];
		$univ[$i]['Students'] = round($row['Students'],0);
		if($row['FS']>0)
		{$univ[$i]['FS'] = round($row['FS'],0);}
		else{$univ[$i]['FS'] = $row['FS'];}
		$univ[$i]['Faculty'] = round($row['Faculty'],0);
		$univ[$i]['country'] = $row['Economy'];
		$univ[$i]['region'] = $row['Region'];
		$univ[$i]['flag'] = $row['Flag'];
		$univ[$i]['logo'] = $row['Logo'];
		$univ[$i]['loc'] = $row['Location'];
		$univ[$i]['found'] = $row['Foundation'];
		$univ[$i]['sh_nm'] = $row['Short name'];
		$univ[$i]['type'] = $row['Type'];
		$univ[$i]['website'] = $row['Web_site'];
		$univ[$i]['cord'] = $row['cord'];
		$univ[$i]['nm_page'] = $row['nm_page'];
		$univ[$i]['O_CR'] = round($row['O_CR'],0);
		$univ[$i]['O_WR'] = round($row['O_WR'],0);$univ[$i]['O_WS'] = round($row['O_WS'], 3);	
		$univ[$i]['O_TR'] = round($row['O_TR'],0);$univ[$i]['O_TS'] = round($row['O_TS'], 3);	
		$univ[$i]['O_RR'] = round($row['O_RR'],0);$univ[$i]['O_RS'] = round($row['O_RS'], 3);	
		$univ[$i]['O_IR'] = round($row['O_IR'],0);$univ[$i]['O_IS'] = round($row['O_IS'], 3);	
		$univ[$i]['O_FR'] = round($row['O_FR'],0);$univ[$i]['O_FS'] = round($row['O_FS'], 3);	
		$univ[$i]['League'] = $row['O_OL'];
		$univ[$i]['O_80p'] = $row['O_80p'];$univ[$i]['O_O_s'] = $row['O_O_s'];
		
		$univ[$i]['O_Color1'] = $row['O_Color1'];;$univ[$i]['O_Color3'] = $row['O_Color3'];$univ[$i]['O_Color4'] = $row['O_Color4'];
		$univ[$i]['T_Os'] = $row['O_T_s'];
		$univ[$i]['T_Color1'] = $row['T_Color1'];$univ[$i]['T_Color3'] = $row['T_Color3'];$univ[$i]['T_Color4'] = $row['T_Color4'];
		$univ[$i]['R_Os'] = $row['O_R_s'];
		$univ[$i]['R_Color1'] = $row['R_Color1'];$univ[$i]['R_Color3'] = $row['R_Color3'];$univ[$i]['R_Color4'] = $row['R_Color4'];
		$univ[$i]['I_Os'] = $row['O_I_s'];
		$univ[$i]['I_Color1'] = $row['I_Color1'];$univ[$i]['I_Color3'] = $row['I_Color3'];$univ[$i]['I_Color4'] = $row['I_Color4'];
		$univ[$i]['F_Os'] = $row['O_F_s'];
		$univ[$i]['F_Color1'] = $row['F_Color1'];$univ[$i]['F_Color3'] = $row['F_Color3'];$univ[$i]['F_Color4'] = $row['F_Color4'];
		
	}
	$n=$i;
	//echo $cntr.'<br>';
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
			$country[$row['id_country']]['id_country']=round($row['id_country'],0);
			$country[$row['id_country']]['Country']=$row['Country'];
			$country[$row['id_country']]['cord']=$row['cord'];
			$country[$row['id_country']]['scale']=round($row['scale'],0);
			$country[$row['id_country']]['cntr_code']=$row['cntr_code'];
			$country[$row['id_country']]['cntr_iso']=$row['cntr_iso'];
			$country[$row['id_country']]['code_cntr']=$row['code_cntr'];
			$country[$row['id_country']]['code_reg']=$row['code_reg'];	
		}
		$c=$j;
	
		$res = [$n, $univ,$c,$country];
		header('Content-Type: application/json');
		echo json_encode( $res);
		
	?>					