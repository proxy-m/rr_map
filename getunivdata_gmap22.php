<?php
session_start();
if($_REQUEST['year']!=''){$year =$_REQUEST['year'];}else{$year =12;}
if($_REQUEST['subj']!=''){$subj =$_REQUEST['subj'];}else{$subj =1;}
if($_REQUEST['cntr']!=''){$cntr =$_REQUEST['cntr'];}else{$cntr =79;}
//$cntr =3;
if($_REQUEST['reg']!=''){$reg =$_REQUEST['reg'];}else{$reg =1;}
//$reg =3;
$sb=[];
$sb[1]='SO';$sb[2]='SH';$sb[3]='SL';$sb[4]='SM';$sb[5]='SN';$sb[6]='SS';$sb[7]='SE';
$univ = [];$i=0;$country=[];$infomap=[];
//echo $year.' '.$subj.' '.$cntr.' '.$reg.'<br>';
$db   =  new PDO('sqlite:raundrank.sqlite');
if($cntr==0)
{
	if($reg==0)
	{
		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.';';
//		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' LIMIT 50;';
		//echo $sql.'<br>';
	}
	else
	{
		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_reg = '.$reg.';';
//		$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_reg = '.$reg.' LIMIT 50;';
	}
}
else
{
//$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_country = '.$cntr.' LIMIT 50;';
$sql = 'SELECT t1.id_univ,t2.[Univ name],t3.Country AS Economy,t3.Region,t3.Flag,t2.Logo,t2.Location,t2.Foundation,t2.[Short name],t2.Type,t2.Web_site,t2.cord,t2.nm_page,t2.Faculty,t2.Students,t1.Faculty AS Faculty_rur,t1.Students AS Students_rur,t1.O_CR,t1.O_WR,t1.O_WS,t1.O_TR,t1.O_TS,t1.O_RR,t1.O_RS,t1.O_IR,t1.O_IS,t1.O_FR,t1.O_FS,t4.League AS O_OL,t9.O_80p,t9.O_O_s,t10.O_T_s,t11.O_R_s,t12.O_I_s,t13.O_F_s,t4.Color1 AS O_Color1,t4.Color3 AS O_Color3,t4.Color4 AS O_Color4,t5.Color1 AS T_Color1,t5.Color3 AS T_Color3,t5.Color4 AS T_Color4,t6.Color1 AS R_Color1,t6.Color3 AS R_Color3,t6.Color4 AS R_Color4,t7.Color1 AS I_Color1,t7.Color3 AS I_Color3,t7.Color4 AS I_Color4,t8.Color1 AS F_Color1,t8.Color3 AS F_Color3,t8.Color4 AS F_Color4 FROM rur AS t1 JOIN Univ AS t2 ON t1.id_univ = t2.id_univ JOIN Country AS  t3 ON t2.id_country = t3.id_country JOIN League AS t4 ON t1.id_OL = t4.id_leag JOIN League AS t5 ON t1.id_TL = t5.id_leag JOIN League AS t6 ON t1.id_RL = t6.id_leag JOIN League AS t7 ON t1.id_IL = t7.id_leag JOIN League AS t8 ON t1.id_FL = t8.id_leag JOIN picleag AS t9 ON t1.id_OL = t9.id_leag AND t1.id_subj = t9.id_subj JOIN picleag AS t10 ON t1.id_TL = t10.id_leag AND t1.id_subj = t10.id_subj JOIN picleag AS t11 ON t1.id_RL = t11.id_leag AND t1.id_subj = t11.id_subj JOIN picleag AS t12 ON t1.id_IL = t12.id_leag AND t1.id_subj = t12.id_subj JOIN picleag AS t13 ON t1.id_FL = t13.id_leag AND t1.id_subj = t13.id_subj JOIN year AS t14 ON t1.id_year = t14.id_year JOIN Subject AS t15 ON t1.id_subj = t15.id_subj  WHERE t14.id_year = '.$year.' AND t15.id_subj = '.$subj.' AND t3.id_country = '.$cntr.';';
}	
//echo $sql.'<br>';

	$st = $db->prepare($sql);
	$st->execute();	
	$rr = $st->fetchAll();
    
//    $rr_cache = $_SESSION['rr_cache'] ?? array();
//
//    if (empty($rr_cache[$year])) {
//        $st = $db->prepare($sql);
//        $st->execute();	
//        $rr = $st->fetchAll();
//        $rr_cache[$year] = $rr; // TODO: other countries
//    } else {
//        $rr = $rr_cache[$year];
//    }

	foreach ($rr as $row)
	{
		//if($row['Economy']!='USA' && $row['Economy']!='Switzerland' && $row['Economy']!='Turkey')
		//if($row['Economy']!='USA')
		//{
			//if($row['id_univ']!=1222)
			//{
			$i++;
			$univ[$i]['id_univ'] = round($row['id_univ'] ?? 0, 0);
			$univ[$i]['univ_name'] = $row['Univ name'];
			if(!$row['Students']){$univ[$i]['Students'] = round($row['Students_rur'],0);}
			else{$univ[$i]['Students'] = round($row['Students'],0);}
			if(!$row['Faculty']){$univ[$i]['Faculty'] = round($row['Faculty_rur'],0);}
			else{$univ[$i]['Faculty'] = round($row['Faculty'],0);}
			
			if($univ[$i]['Faculty']!=0)
			{$univ[$i]['FS'] = round($univ[$i]['Students']/$univ[$i]['Faculty'],0);}
			else{$univ[$i]['FS']=0;}
			
			$univ[$i]['country'] = $row['Economy'] ?? $row['Country'] ?? $row['country'] ?? 'UnknownCountry';
			$univ[$i]['region'] = $row['Region'] ?? $row['region'] ?? NULL;
			$univ[$i]['flag'] = $row['Flag'] ?? $row['flag'] ?? NULL;
			
            $row['Logo'] = $row['Logo'] ?? $row['logo'] ?? NULL;
			if($row['Logo']!='' && $row['Logo']!=NULL)
			{$univ[$i]['logo'] = $row['Logo'];}
			else{$univ[$i]['logo']='./images_rur/Logo.png';}
            
            $row['loc'] = $row['loc'] ?? $row['Location'] ?? NULL;
			if($row['loc']!='' && $row['loc']!=NULL)
			{$univ[$i]['loc'] = $row['loc'];}
			else{$univ[$i]['loc']='No Location';}
			
            $row['found'] = $row['found'] ?? $row['Foundation'] ?? NULL;
			if($row['found']!='' && $row['found']!=NULL)
			{$univ[$i]['found'] = $row['found'];}
			else{$univ[$i]['found']='No Foundation';}
			
            $row['sh_nm'] = $row['sh_nm'] ?? $row['Short name'] ?? NULL;
			if($row['sh_nm']!='' && $row['sh_nm']!=NULL)
			{$univ[$i]['sh_nm'] = $row['sh_nm'];}
			else{$univ[$i]['sh_nm']='No Short name';}
            
			
            $row['type'] = $row['type'] ?? $row['Type'] ?? NULL;
			if($row['type']!='' && $row['type']!=NULL)
			{$univ[$i]['type'] = $row['type'];}
			else{$univ[$i]['type']='No Type';}
			
            $row['website'] = $row['website'] ?? $row['Web_site'] ?? NULL;
			if($row['website']!='' && $row['website']!=NULL)
			{$univ[$i]['website'] = $row['website'];}
			else{$univ[$i]['website']='https://roundranking.com/';}
			
			if($row['cord']!='' && $row['cord']!=NULL)
			{$univ[$i]['cord'] = $row['cord'];}
			else{$univ[$i]['cord']='0,0';}
			$iscord=explode(",", $row['cord']);
			if(!is_numeric($iscord[0]))
			{$univ[$i]['cord']='0,0';}
			
			
			
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
			
			$infomap[$i]='<div style="overflow:auto;font-family:arial;border:2px'. $univ[$i]['O_Color1']. 'solid;border:2px '. $univ[$i]['O_Color1']. ' solid;padding:10px;padding-right:32px;padding-bottom:16px"><table style="font-family:arial;width:560px;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr>';
			$infomap[$i].='<td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'. $univ[$i]['logo']. '" style="vertical-align:top;width: 8em;height: 8em;" ></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color:'. $univ[$i]['O_Color1']. ';font-size:17px"><strong>'. $univ[$i]['univ_name']. '</strong></span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td>';
			$infomap[$i].='<td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['found']. '</span></td>';
			$infomap[$i].='<td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'. $univ[$i]['flag']. '" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color:'. $univ[$i]['O_Color1']. '"><strong></strong></span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['sh_nm']. '</span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['type']. '</span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['Students']. '</span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['Faculty']. '</span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'. $univ[$i]['website']. '" target="_blank">'. $univ[$i]['website']. '</a></span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['region']. '</span></td></tr>';
			$infomap[$i].='<tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'. $univ[$i]['loc']. '</span></td></tr>';
			$infomap[$i].='<tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top:'. $univ[$i]['O_Color1']. ' 2px solid"></td><td></td></tr>';
			$infomap[$i].='<tr><td style="font-family:arial;width:114px;text-align:center" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'. $univ[$i]['O_80p']. '" style=";width: 5em;height: 5em;" alt=""><br><div style="font-family:arial;color:#fff;font-size:14pt;font-weight:bold;padding-top:25px">'. $univ[$i]['O_WR']. '</div></div>';
			$infomap[$i].='<div style="font-family:arial;width:80px"><strong><span style="color:'. $univ[$i]['O_Color1']. '"><span style="font-size:13pt">'. $univ[$i]['O_WR']. '</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color:'. $univ[$i]['O_Color1']. '"><span style="font-size:13pt">'. $univ[$i]['League']. '</span></span></strong></div></td>';
			$infomap[$i].='<td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color:'. $univ[$i]['O_Color1']. '"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color:'. $univ[$i]['O_Color1']. '"><strong>'. $univ[$i]['O_CR']. '</strong></span></span></p></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top:'. $univ[$i]['O_Color1']. ' 2px solid"></td><td></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;background:'. $univ[$i]['O_Color4']. ';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'. $univ[$i]['O_O_s']. '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_WR']. '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_WS']. '</span></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;height:20px;background:'. $univ[$i]['T_Color4']. '"><td style="font-family:arial;width:50px"><img alt="" src="'. $univ[$i]['T_Os']. '" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'. $univ[$i]['O_TR']. '</td><td class="style6" style="width:98px"><span style="font-size:9pt">'. $univ[$i]['O_TS']. '</span></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;background:'. $univ[$i]['R_Color4']. '"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'. $univ[$i]['R_Os']. '" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_RR']. '</td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_RS']. '</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color:#999999"><a href="https://roundranking.com/universities/'.$univ[$i]['nm_page'].'.html?sort=O&year='.(intval($year)+2009).'&subject='.$sb[$subj].'" target="_blank">View full university profile</a></span></span></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;height:26px;background:'. $univ[$i]['I_Color4']. '"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'. $univ[$i]['I_Os']. '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_IR']. '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_IS']. '</span></td></tr>';
			$infomap[$i].='<tr style="font-family:arial;background:'. $univ[$i]['F_Color4']. ';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'. $univ[$i]['F_Os']. '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_FR']. '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'. $univ[$i]['O_FS']. '</span></td></tr></tbody></table></div>';
			//$infomap[$i].='';
		//}
	//}
	}
	$n=$i;
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
	
		$res = [$n, $univ,$c,$country,$infomap];
		header('Content-Type: application/json');
		echo json_encode( $res);
		
	?>					
