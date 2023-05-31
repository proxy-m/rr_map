<?php
date_default_timezone_set('UTC');
$db= new PDO('sqlite:raundrank.sqlite');
$n=0;
$sqln= 'SELECT count(id_univ) AS cntun FROM Univ WHERE 1;';
$stn = $db->prepare($sqln);
$stn->execute();
$rrn= $stn->fetchAll();
foreach($rrn as $rown)
{
$n=$rown['cntun'];	
}
$m=0;
$sqlm= 'SELECT max(id_recipt) AS mxpc FROM recipt WHERE 1;';
$stm = $db->prepare($sqlm);
$stm->execute();
$rrm= $stm->fetchAll();
foreach($rrm as $rowm)
{
$m=$rowm['mxpc'];	
}
$recpt=Array();$recnt=Array();
for($i=1;$i<=$n;$i++)
{	$recnt[$i]=0;
	$sql= 'SELECT id_recipt,id_univ,Univ_name,office,full_name_eng,io_rus,email,ismain,rus_nmuniv FROM recipt WHERE id_univ='.$i.';';
//echo $sql;
	$st = $db->prepare($sql);
	if($st)
	{
		$st->execute();
		$rr= $st->fetchAll();
		foreach($rr as $row)
		{
			$recnt[$i]++;
			
			$recpt[$i][$recnt[$i]]['id_recipt']=$row['id_recipt'];
			$recpt[$i][$recnt[$i]]['Univ_name']=$row['Univ_name'];
			$recpt[$i][$recnt[$i]]['office']=$row['office'];
			if($row['io_rus']=='')
			{$recpt[$i][$recnt[$i]]['fio']=$row['full_name_eng'];}
			else
			{$recpt[$i][$recnt[$i]]['fio']=$row['io_rus'];}
			$recpt[$i][$recnt[$i]]['email']=$row['email'];
			$recpt[$i][$recnt[$i]]['ismain']=$row['ismain'];
			$recpt[$i][$recnt[$i]]['univ_encode']=urlencode($row['Univ_name']);
			$recpt[$i][$recnt[$i]]['rus_nmuniv']=$row['rus_nmuniv'];
			
		}
		
	}
}
$recnt[0]=0;
	$sql= 'SELECT id_recipt,id_univ,office,io_rus,email FROM recipt WHERE id_univ = 0;';
//echo $sql;
	$st = $db->prepare($sql);
	if($st)
	{
		$st->execute();
		$rr= $st->fetchAll();
		foreach($rr as $row)
		{
			$recnt[0]++;
			$recpt[0][$recnt[0]]['id_recipt']=$row['id_recipt'];
			$recpt[0][$recnt[0]]['Univ_name']=0;
			$recpt[0][$recnt[0]]['office']=$row['office'];
			if($row['io_rus']=='')
			{$recpt[$i][$recnt[$i]]['fio']=$row['full_name_eng'];}
			else
			{$recpt[$i][$recnt[$i]]['fio']=$row['io_rus'];}
			$recpt[0][$recnt[0]]['email']=$row['email'];
			$recpt[0][$recnt[0]]['ismain']=$row['ismain'];
		}
	}
	$rect=array($n,$recpt,$m,$recnt);
	header('Content-Type: application/json');
	echo json_encode( $rect);
	/*$fp = fopen('recipt.json', 'w');
	fwrite($fp, json_encode($recpt));
	fclose($fp);*/
?>