<?php
	$year = isset($_REQUEST['year'])?$_REQUEST['year']: 2019;
	$subj = isset($_REQUEST['subj'])?urldecode($_REQUEST['subj']): 'Overall';
	$unnm = isset($_REQUEST['unnm'])?urldecode($_REQUEST['unnm']): 'Aalto University';
	/*$unnmn=urldecode($unnm);
	$subj=urldecode($subj);*/
//	echo ($year.$subj.$unnm.$_REQUEST['unnm']); 
$db   =  new PDO('sqlite:raundrank.sqlite');
$repr = array();
/*
if($year!=2018)
{$sqlr='SELECT t1.O_WR AS O_WRr,t1.O_WS AS O_WSr,t2.O_WR AS O_WRp,t2.O_WS AS O_WSp  FROM rur2 AS t1 JOIN rur_perform AS t2 ON t1.id_univ = t2.id_univ AND t1.id_year = t2.id_year JOIN Univ AS t3 ON t1.id_univ = t3.id_univ AND t2.id_univ = t3.id_univ JOIN year AS t4 ON t1.id_year = t4.id_year WHERE t4.year ='.$year.' AND t3.[Univ name] ="'.$unnm.'";';}
else{$sqlr='SELECT t1.O_WR AS O_WRr,t1.O_WS AS O_WSr FROM rur2 AS t1 JOIN Univ AS t3 ON t1.id_univ = t3.id_univ JOIN year AS t4 ON t1.id_year = t4.id_year WHERE t4.year ='.$year.' AND t3.[Univ name] ="'.$unnm.'";';}
*/
//if($year=='2018')
//{
//	$sqlr='SELECT t2.O_WR AS O_WRp,t2.O_WS AS O_WSp FROM rur2 AS t1 JOIN rur_perform AS t2 JOIN Univ AS t3 ON t2.id_univ = t3.id_univ JOIN year AS t4 ON t2.id_year = t4.id_year WHERE t4.year ='.$year.' AND t3.[Univ name] ="'.$unnm.'";';
//}
//else{
$sqlr='SELECT t1.O_WR AS O_WRr,t1.O_WS AS O_WSr,t2.O_WR AS O_WRp,t2.O_WS AS O_WSp  FROM rur2 AS t1 JOIN rur_perform AS t2 ON t1.id_univ = t2.id_univ AND t1.id_year = t2.id_year JOIN Univ AS t3 ON t1.id_univ = t3.id_univ AND t2.id_univ = t3.id_univ JOIN year AS t4 ON t1.id_year = t4.id_year WHERE t4.year ='.$year.' AND t3.[Univ name] ="'.$unnm.'";';
//}
//echo $sqlr;
	$str = $db->prepare($sqlr);
	$str->execute();	
	$rrr = $str->fetchAll();
	foreach ($rrr as $rowr)
	{
	$repr['wrr'] = $rowr['O_WRr'];
	$repr['wsr'] = $rowr['O_WSr'];
	$repr['wrp'] = $rowr['O_WRp'];
	$repr['wsp'] = $rowr['O_WSp'];
	}
	/*$year =  '2016';
	$subject = 'Overall';
	$univ_name= ($_GET['univ_name']) ?($_GET['univ_name']) : 'California Institute of Technology (Caltech)';
	$id_univ=$_REQUEST['univ_sel'];*/
//	$id_univ=1;
	$sql = 'SELECT t2.[Univ name],t2.nm_prophil,t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Address,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t1.Faculty,t1.Students,t1.O_CR,t1.T_CR,t1.R_CR,t1.I_CR,t1.F_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t5.League AS O_TL,t6.League AS O_RL,t7.League AS O_IL,t8.League AS O_FL,t1.O_I1,t1.O_I2,t1.O_I3,t1.O_I4,t1.O_I5,t1.O_I6,t1.O_I7,t1.O_I8,t1.O_I9,t1.O_I10,t1.O_I11,t1.O_I12,t1.O_I13,t1.O_I14,t1.O_I15,t1.O_I16,t1.O_I17,t1.O_I18,t1.O_I19,t1.O_I20,t1.IR1,t1.IR2,t1.IR3,t1.IR4,t1.IR5,t1.IR6,t1.IR7,t1.IR8,t1.IR9,t1.IR10,t1.IR11,t1.IR12,t1.IR13,t1.IR14,t1.IR15,t1.IR16,t1.IR17,t1.IR18,t1.IR19,t1.IR20,t2.Overview,t2.Mission,t2.Picture1,t2.Picture2,t9.O_80p,t9.O_O_s,t9.O_T_s,t9.O_R_s,t9.O_I_s,t9.O_F_s,t4.Color1 AS O_Color1,t4.Color2 AS O_Color2,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t10.T_80p,t10.T_Os,t10.T_Ts,t10.T_Rs,t10.T_Is,t10.T_Fs,t5.Color1 AS T_Color1,t5.Color2 AS T_Color2,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t11.R_80p,t11.R_Os,t11.R_Ts,t11.R_Rs,t11.R_Is,t11.R_Fs,t6.Color1 AS R_Color1,t6.Color2 AS R_Color2,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t12.I_80p,t12.I_Os,t12.I_Ts,t12.I_Rs,t12.I_Is,t12.I_Fs,t7.Color1 AS I_Color1,t7.Color2 AS I_Color2,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t13.F_80p,t13.F_Os,t13.F_Ts,t13.F_Rs,t13.F_Is,t13.F_Fs,t8.Color1 AS F_Color1,t8.Color2 AS F_Color2,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4,t14.year,t1.FS,t1.Sc,t15.subject AS Subject  FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.year ='.$year.' AND  t15.subject ="'.$subj.'" AND  t2.[Univ name]  ="'.$unnm.'" LIMIT 1;';
//	echo $sql;
	$st = $db->prepare($sql);
	$st->execute();	
	$rr = $st->fetchAll();
	$universities = array();
	foreach ($rr as $row)
	{
		$universities['univ_name'] = $row['Univ name'];
		$universities['nm_prophil'] = $row['nm_prophil'];
		$universities['country'] = $row['Economy'];
		$universities['region'] = $row['Region'];
		$universities['flag'] = $row['Flag'];
		$universities['logo'] = $row['Logo'];
		$universities['addr'] = $row['Address'];
		$universities['loc'] = $row['Location'];
		$universities['found'] = $row['Foundation'];
		$universities['sh_nm'] = $row['Short name'];
		$universities['type'] = $row['Type'];
		$universities['website'] = $row['Web_site'];
		if($year>2017)
		{
			$universities['fac'] = round($row['Faculty'],-1);
			$universities['stud'] = round($row['Students'],-1);
		}
		else
		{
			$universities['fac'] = round($row['Faculty'],0);
			$universities['stud'] = round($row['Students'],0);
		}
		
		$universities['O_CR'] = $row['O_CR'];
		$universities['T_CR'] = $row['T_CR'];
		$universities['R_CR'] = $row['R_CR'];
		$universities['I_CR'] = $row['I_CR'];
		$universities['F_CR'] = $row['F_CR'];
		$universities['O_WR'] = $row['O_WR'];$universities['O_WS'] = number_format($row['O_WS'], 3, '.', '');	
		$universities['O_TR'] = $row['O_TR'];$universities['O_TS'] = number_format($row['O_TS'], 3, '.', '');	
		$universities['O_RR'] = $row['O_RR'];$universities['O_RS'] = number_format($row['O_RS'], 3, '.', '');	
		$universities['O_IR'] = $row['O_IR'];$universities['O_IS'] = number_format($row['O_IS'], 3, '.', '');	
		$universities['O_FR'] = $row['O_FR'];$universities['O_FS'] = number_format($row['O_FS'], 3, '.', '');	
		$universities['O_OL'] = $row['O_OL'];$universities['O_TL'] = $row['O_TL'];
		$universities['O_RL'] = $row['O_RL'];$universities['O_IL'] = $row['O_IL'];
		$universities['O_FL'] = $row['O_FL'];
		$universities['O_I1'] = number_format($row['O_I1'], 3, '.', '');
		$universities['O_I2'] = number_format($row['O_I2'], 3, '.', '');
		$universities['O_I3'] = number_format($row['O_I3'], 3, '.', '');
		$universities['O_I4'] = number_format($row['O_I4'], 3, '.', '');
		$universities['O_I5'] = number_format($row['O_I5'], 3, '.', '');
		$universities['O_I6'] = number_format($row['O_I6'], 3, '.', '');
		$universities['O_I7'] = number_format($row['O_I7'], 3, '.', '');
		$universities['O_I8'] = number_format($row['O_I8'], 3, '.', '');	
		$universities['O_I9'] = number_format($row['O_I9'], 3, '.', '');
		$universities['O_I10'] = number_format($row['O_I10'], 3, '.', '');	
		$universities['O_I11'] = number_format($row['O_I11'], 3, '.', '');
		$universities['O_I12'] = number_format($row['O_I12'], 3, '.', '');
		$universities['O_I13'] = number_format($row['O_I13'], 3, '.', '');
		$universities['O_I14'] = number_format($row['O_I14'], 3, '.', '');
		$universities['O_I15'] = number_format($row['O_I15'], 3, '.', '');
		$universities['O_I16'] = number_format($row['O_I16'], 3, '.', '');
		$universities['O_I17'] = number_format($row['O_I17'], 3, '.', '');
		$universities['O_I18'] = number_format($row['O_I18'], 3, '.', '');	
		$universities['O_I19'] = number_format($row['O_I19'], 3, '.', '');
		$universities['O_I20'] = number_format($row['O_I20'], 3, '.', '');				
		$universities['IR1'] = $row['IR1'];$universities['IR2'] = $row['IR2'];$universities['IR3'] = $row['IR3'];
		$universities['IR4'] = $row['IR4'];$universities['IR5'] = $row['IR5'];$universities['IR6'] = $row['IR6'];
		$universities['IR7'] = $row['IR7'];$universities['IR8'] = $row['IR8'];$universities['IR9'] = $row['IR9'];
		$universities['IR10'] = $row['IR10'];$universities['IR11'] = $row['IR11'];$universities['IR12'] = $row['IR12'];
		$universities['IR13'] = $row['IR13'];$universities['IR14'] = $row['IR14'];$universities['IR15'] = $row['IR15'];
		$universities['IR16'] = $row['IR16'];$universities['IR17'] = $row['IR17'];$universities['IR18'] = $row['IR18'];
		$universities['IR19'] = $row['IR19'];$universities['IR20'] = $row['IR20'];
		$universities['over'] = $row['Overview'];$universities['miss'] = $row['Mission'];
		$universities['pic1'] = $row['Picture1'];$universities['pic2'] = $row['Picture2'];
		$universities['O_80p'] = $row['O_80p'];$universities['O_O_s'] = $row['O_O_s'];
		$universities['O_T_s'] = $row['O_T_s'];$universities['O_R_s'] = $row['O_R_s'];
		$universities['O_I_s'] = $row['O_I_s'];$universities['O_F_s'] = $row['O_F_s'];
		$universities['O_Color1'] = $row['O_Color1'];$universities['O_Color2'] = $row['O_Color2'];
		$universities['O_Color3'] = $row['O_Color3'];$universities['O_Color4'] = $row['O_Color4'];
		$universities['T_80p'] = $row['T_80p'];$universities['T_Os'] = $row['T_Os'];
		$universities['T_Ts'] = $row['T_Ts'];$universities['T_Rs'] = $row['T_Rs'];
		$universities['T_Is'] = $row['T_Is'];$universities['T_Fs'] = $row['T_Fs'];
		$universities['T_Color1'] = $row['T_Color1'];$universities['T_Color2'] = $row['T_Color2'];
		$universities['T_Color3'] = $row['T_Color3'];$universities['T_Color4'] = $row['T_Color4'];
		$universities['R_80p'] = $row['R_80p'];$universities['R_Os'] = $row['R_Os'];
		$universities['R_Ts'] = $row['R_Ts'];$universities['R_Rs'] = $row['R_Rs'];
		$universities['R_Is'] = $row['R_Is'];$universities['R_Fs'] = $row['R_Fs'];
		$universities['R_Color1'] = $row['R_Color1'];$universities['R_Color2'] = $row['R_Color2'];
		$universities['R_Color3'] = $row['R_Color3'];$universities['R_Color4'] = $row['R_Color4'];	
		$universities['I_80p'] = $row['I_80p'];$universities['I_Os'] = $row['I_Os'];
		$universities['I_Ts'] = $row['I_Ts'];$universities['I_Rs'] = $row['I_Rs'];
		$universities['I_Is'] = $row['I_Is'];$universities['I_Fs'] = $row['I_Fs'];
		$universities['I_Color1'] = $row['I_Color1'];$universities['I_Color2'] = $row['I_Color2'];
		$universities['I_Color3'] = $row['I_Color3'];$universities['I_Color4'] = $row['I_Color4'];	
		$universities['F_80p'] = $row['F_80p'];$universities['F_Os'] = $row['F_Os'];
		$universities['F_Ts'] = $row['F_Ts'];$universities['F_Rs'] = $row['F_Rs'];
		$universities['F_Is'] = $row['F_Is'];$universities['F_Fs'] = $row['F_Fs'];
		$universities['F_Color1'] = $row['F_Color1'];$universities['F_Color2'] = $row['F_Color2'];
		$universities['F_Color3'] = $row['F_Color3'];$universities['F_Color4'] = $row['F_Color4'];	
		$universities['year'] = $row['year'];$universities['fs'] = $row['FS'];$universities['subj'] = $row['Subject'];	
		$universities['cord'] = $row['cord'];$universities['nm_page'] = $row['nm_page'];$universities['Sc'] = $row['Sc'];
	}
		$res = array_merge($repr, $universities);
		header('Content-Type: application/json');
		echo json_encode( $res);
		
	?>					