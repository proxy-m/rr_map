var yr,sb,cntr,reg,n,sv,lftur,hs;
var dt=new Array;var dtmap=new Array; var dtrow=new Array;
var tph;				//текст массива вузов для typehead
var tphcord=new Array;	//массив координат поиска
var tphunnm=new Array;	//массив имен вузов поиска
var cordtph=new Array;	//массив координат вузов по поиску
var map=new Object;
var data;
var dtcntr=new Array;	//массив данных стран для карт
$(document).ready(function () 
{
  	$('.item-111').removeClass('active');
	$('.item-111').removeClass('carent');
	$('.item-110').addClass('active');
  	//$.gmap3({key: 'AIzaSyD7fU9MnAARspyROArfcaxENAgguWvDQHg'});
	
	sb=$('.mfilter-subject select option:selected').val();
	yr=$('.mfilter-year select option:selected').val();
	reg=$('.mfilter-region select option:selected').val();
	if(Number($('.mfilter-country select option:selected').val()))
	{cntr=$('.mfilter-country select option:selected').val();}
	else{cntr=0;}
	country_list();
	subjectview();
  	//$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');
	//setTimeout(function(){setmap();},100);
    
	///setTimeout(function(){initMap();},100);


	
	$(document).on('click', '.main-nav li', function () {
		$('.main-nav li').removeClass('active');
		$(this).addClass('active');
	});
	$(document).on('click', '.nav-btn', function () {
		if ($('.main-nav').hasClass('show')) {
			$('.main-nav').removeClass('show').slideDown();
		} else {
			$('.main-nav').addClass('show').slideUp();
		}
		return false;
	});
	$(document).on('change', '.mfilter-year select', function () 
	{
		yr=$('.mfilter-year select option:selected').val();
		subjectview();
		country_list();
		$('.mapinfo').html('<div id="map_div"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
		//return false;
	});
	$(document).on('click', '#mctrvz', function () 
	{
		sb=$('.mfilter-subject select option:selected').val();
		yr=$('.mfilter-year select option:selected').val();
		reg=$('.mfilter-region select option:selected').val();
		if(Number($('.mfilter-country select option:selected').val()))
		{cntr=$('.mfilter-country select option:selected').val();}
		else{cntr=0;}
		initMap();
	});      
	$(document).on('change', '.mfilter-country select', function ()
	{
		//alert($('.az-sort-by-cntr').val());
		if(Number(($('.mfilter-country select').val())>0))
		{
			//$('.az-sort-by-s').attr('disabled',true);
			//$('.az-sort-by-r').attr('disabled',true);
			sb=$('.mfilter-subject select option:selected').val();
			yr=$('.mfilter-year select option:selected').val();
			reg=$('.mfilter-region select option:selected').val();
			if(Number($('.mfilter-country select option:selected').val()))
			{cntr=$('.mfilter-country select option:selected').val();}
			else{cntr=0;}
		}
		else
		{
			$('.mfilter-region select').removeAttr('disabled');
			$('.mfilter-subject select').removeAttr('disabled');
			sb=$('.mfilter-subject select option:selected').val();
			yr=$('.mfilter-year select option:selected').val();
			reg=$('.mfilter-region select option:selected').val();
			if(Number($('.mfilter-country select option:selected').val()))
			{cntr=$('.mfilter-country select option:selected').val();}
			else{cntr=0;}
		}
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
    	$('#mapsrchvl').val('');
	}); 
	$(document).on('change', '.mfilter-region  select', function ()
	{
		
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		//$('.az-sort-by-cntr').html('<option value="0">World</option>');
		country_list();
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
	});
	$(document).on('change', '.maz-sort-by-s', function ()
	{
		yr=$('.mfilter-year select option:selected').val();
		sb=$('.mfilter-subject select option:selected').val();
		yr=$('.mfilter-year select option:selected').val();
		reg=$('.mfilter-region select option:selected').val();
		if(Number($('.mfilter-country select option:selected').val()))
		{cntr=$('.mfilter-country select option:selected').val();}
		else{cntr=0;}
		country_list();
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
	});
	$(document).on('click', '#mapsrchvl', function ()
	{
		$('#mapsrchvl').val('');
		$('#mapsrchvl').attr('placeholder','');
		//$('.mpsrch').css('display','block');
	});
	$(document).on('change', '#mapsrchvl', function ()
	{
		$('#tphsel option:contains("'+$('#mapsrchvl').val()+'")').prop('selected', true);	
		if(Number($('#mapsrchvl').val().length)>0)
		{$('#mapsrchbtn').removeAttr('disabled');}
		
	});

	$(document).on('click', '#mapsrchbtn', function ()
	{
		//$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
      	//$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');
		initMap();
	});
    

	function subjectview()
	{
		
		yr=$('.mfilter-year select option:selected').val();
		//alert(yr);
		if(Number(yr)<5||Number(yr)==13)
		{
			if(yr<5)
			{
				$('.mfilter-subject select option[value="2"]').remove();
				$('.mfilter-subject select option[value="3"]').remove();
				$('.mfilter-subject select option[value="4"]').remove();
				$('.mfilter-subject select option[value="5"]').remove();
				$('.mfilter-subject select option[value="6"]').remove();
				$('.mfilter-subject select option[value="7"]').remove();
				$('.mfilter-subject select option[value="1"]').attr('selected',true);
			}
			else
			{
				/*$('.mfilter-subject select option[value="2"]').remove();
				$('.mfilter-subject select option[value="3"]').remove();
				$('.mfilter-subject select option[value="4"]').remove();
				$('.mfilter-subject select option[value="5"]').remove();
				$('.mfilter-subject select option[value="6"]').remove();
				$('.mfilter-subject select option[value="7"]').remove();*/
				$('.mfilter-subject select option[value="1"]').attr('selected',true);
			}
		}
		else
		{
			if(!$('.mfilter-subject select option[value="2"]').val())
            {$('.mfilter-subject select').append('<option value="2">Humanities</option>');}
			if(!$('.mfilter-subject select option[value="3"]').val())
            {$('.mfilter-subject select').append('<option value="3">Life Sciences</option>');}
            if(!$('.mfilter-subject select option[value="4"]').val())
            {$('.mfilter-subject select').append('<option value="4">Medical Sciences</option>');}
            if(!$('.mfilter-subject select option[value="5"]').val())
            {$('.mfilter-subject select').append('<option value="5">Natural Sciencest</option>');}
            if(!$('.mfilter-subject select option[value="6"]').val())
            {$('.mfilter-subject select').append('<option value="6">Social Sciences</option>');}
            if(!$('.mfilter-subject select option[value="7"]').val())
            {$('.mfilter-subject select').append('<option value="7">Technical Sciences</option>');}
            
		}
	}
	function initMap()
	{
		
		if(Number($('#mapsrchvl').val().length)==0)
		{
			var ur='./final/getunivdata_gmap22.php?year='+yr+'&subj='+sb+'&cntr='+cntr+'&reg='+reg;
			
			//alert(ur);
			leftur='https://roundranking.com/universities/';hs='';
          	
			$.ajax(
			{
	  		url: ur,
	  			success: function(data)
	  	 		{
		  	 		
		  	 		switch (Number(sb))
					{
						case 1:sv='SO';break;
			 			case 2:sv='SH';break;
			 			case 3:sv='SL';break;
			 			case 4:sv='SM';break;
			 			case 5:sv='SN';break;
			 			case 6:sv='SS';break;
			 			case 7:sv='SE';break;
					  	default:sv='SO';
					}
	  	 		if(Number(data[0])>0)
	  	 		{
	  	 			
	  	 			n=Number(data[0]);
	  	 			//n=540;
	  	 			//alert(n);
	  	 		
	  	 			if(Number(n)>100)
					{$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');}
					else
					{$('.mapinfo').html('<div id="map_div"></div>');}
					
					/*	$('.mapinfo').html('<div id="map_div"></div>');*/
	  	 			tph='';
	  	 			dt.length=0;
	  	 			$('#mapsrchvl').typeahead('destroy');
	  	 			
	  	 			for(var i=1;i<=n;i++)
	  	 			{
						//alert(data[4][i]);
						dt[i]=[];dtrow[i]=[];dtmap=[];
						
						dt[i]['univ_name']=$.trim(data[1][i]['univ_name']);
						dt[i]['country']=data[1][i]['country'];
						dt[i]['region']=data[1][i]['region'];
						dt[i]['Students']=data[1][i]['Students'];
						dt[i]['Faculty']=data[1][i]['Faculty'];
						dt[i]['FS']=data[1][i]['FS'];
						dt[i]['flag']=data[1][i]['flag'];
						dt[i]['logo']=data[1][i]['logo'];
						dt[i]['loc']=data[1][i]['loc'];
						dt[i]['found']=data[1][i]['found'];
						dt[i]['sh_nm']=data[1][i]['sh_nm'];
						dt[i]['type']=data[1][i]['type'];
						dt[i]['website']=data[1][i]['website'];
						
						var crd=data[1][i]['cord'].split(',');
						dt[i]['lat']=crd[0];
						dt[i]['lng']=crd[1];
						//if(Number(cntr)==45)
						//{alert(dt[i]['lat']);}
						//alert(data[1][i]['cord']+'\n'+dt[i]['lat']+'\n'+dt[i]['lng']);
						dt[i]['nm_page']=data[1][i]['nm_page'];
						dt[i]['O_CR']=data[1][i]['O_CR'];dt[i]['League']=data[1][i]['League'];
						dt[i]['O_WR']=data[1][i]['O_WR'];dt[i]['O_WS']=data[1][i]['O_WS'];
						dt[i]['O_TR']=data[1][i]['O_TR'];dt[i]['O_TS']=data[1][i]['O_TS'];
						dt[i]['O_RR']=data[1][i]['O_RR'];dt[i]['O_RS']=data[1][i]['O_RS'];
						dt[i]['O_IR']=data[1][i]['O_IR'];dt[i]['O_IS']=data[1][i]['O_IS'];
						dt[i]['O_FR']=data[1][i]['O_FR'];dt[i]['O_FS']=data[1][i]['O_FS'];
						
						dt[i]['O_80p']=data[1][i]['O_80p'];
						dt[i]['O_O_s']=data[1][i]['O_O_s'];dt[i]['O_Color1']=data[1][i]['O_Color1'];
						dt[i]['O_Color3']=data[1][i]['O_Color3'];dt[i]['O_Color4']=data[1][i]['O_Color4'];
						
						dt[i]['T_Os']=data[1][i]['T_Os'];dt[i]['T_Color1']=data[1][i]['T_Color1'];
						dt[i]['T_Color3']=data[1][i]['T_Color3'];dt[i]['T_Color4']=data[1][i]['T_Color4'];
						
						dt[i]['R_Os']=data[1][i]['R_Os'];dt[i]['R_Color1']=data[1][i]['R_Color1'];
						dt[i]['R_Color3']=data[1][i]['R_Color3'];dt[i]['R_Color3']=data[1][i]['R_Color3'];
						
						dt[i]['I_Os']=data[1][i]['I_Os'];dt[i]['I_Color1']=data[1][i]['I_Color1'];
						dt[i]['I_Color3']=data[1][i]['I_Color3'];dt[i]['I_Color4']=data[1][i]['I_Color4'];
						
						dt[i]['F_Os']=data[1][i]['F_Os'];dt[i]['F_Color1']=data[1][i]['F_Color1'];
						dt[i]['F_Color3']=data[1][i]['F_Color3'];dt[i]['F_Color4']=data[1][i]['F_Color4'];
						
						switch (dt[i]['League'])
						{
							case 'Diamond League':dt[i]['icon']='diamond';dt[i]['iconurl']='./images_rur/Konf/diamondw.png';break;
				 			case 'Golden League':dt[i]['icon']='gold';dt[i]['iconurl']='./images_rur/Konf/goldw.png';break;
				 			case 'Silver League':dt[i]['icon']='silver';dt[i]['iconurl']='./images_rur/Konf/silverw.png';break;
				 			case 'Bronze League':dt[i]['icon']='bronze';dt[i]['iconurl']='./images_rur/Konf/bronzew.png';break;
				 			case 'Copper League':dt[i]['icon']='cooper';dt[i]['iconurl']='./images_rur/Konf/cooperw.png';break;
				 			case 'World League':dt[i]['icon']='world';dt[i]['iconurl']='./images_rur/Konf/worldw.png';break;
						  	default:dt[i]['icon']='world';dt[i]['iconurl']='./images_rur/Konf/worldw.png';
						}

						dt[i]['info']='<div style="overflow:auto;font-family:arial;border:2px'+ dt[i]['O_Color1']+ 'solid;border:2px '+ dt[i]['O_Color1']+ ' solid;padding:10px;padding-right:32px;padding-bottom:16px"><table style="font-family:arial;width:560px;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr>';
						dt[i]['info']+='<td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'+ dt[i]['logo']+ '" style="vertical-align:top;width: 8em;height: 8em;" ></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color:'+ dt[i]['O_Color1']+ ';font-size:17px"><strong>'+ dt[i]['univ_name']+ '</strong></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td>';
						dt[i]['info']+='<td style="width:98px"><span style="font-size:9pt">'+ dt[i]['found']+ '</span></td>';
						dt[i]['info']+='<td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'+ dt[i]['flag']+ '" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color:'+ dt[i]['O_Color1']+ '"><strong></strong></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['sh_nm']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['type']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['Students']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['Faculty']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'+ dt[i]['website']+ '" target="_blank">'+ dt[i]['website']+ '</a></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['region']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['loc']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top:'+ dt[i]['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dt[i]['info']+='<tr><td style="font-family:arial;width:114px;text-align:center" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'+ dt[i]['O_80p']+ '" style=";width: 5em;height: 5em;" alt=""><br><div style="font-family:arial;color:#fff;font-size:14pt;font-weight:bold;padding-top:25px">'+ dt[i]['O_WR']+ '</div></div>';
						dt[i]['info']+='<div style="font-family:arial;width:80px"><strong><span style="color:'+ dt[i]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i]['O_WR']+ '</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color:'+ dt[i]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i]['League']+ '</span></span></strong></div></td>';
						dt[i]['info']+='<td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color:'+ dt[i]['O_Color1']+ '"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color:'+ dt[i]['O_Color1']+ '"><strong>'+ dt[i]['O_CR']+ '</strong></span></span></p></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top:'+ dt[i]['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['O_Color4']+ ';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'+ dt[i]['O_O_s']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_WR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_WS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:20px;background:'+ dt[i]['T_Color4']+ '"><td style="font-family:arial;width:50px"><img alt="" src="'+ dt[i]['T_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i]['O_TR']+ '</td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i]['O_TS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['R_Color4']+ '"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'+ dt[i]['R_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_RR']+ '</td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_RS']+ '</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color:#999999"><a href="'+ leftur + dt[i]['nm_page']+ '.html?sort=O&year='+ Number(yr+2009)+ '&subject='+sv+hs+'" target="_blank">View full university profile</a></span></span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:26px;background:'+ dt[i]['I_Color4']+ '"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'+ dt[i]['I_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_IR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_IS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['F_Color4']+ ';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'+ dt[i]['F_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_FR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_FS']+ '</span></td></tr></tbody></table></div>';
						
						//dt[i]['info']=data[4][i];
						//alert(dt[i]['info']);
						//dtrow[i]={Number(dt[i]['lat']),Number(dt[i]['lng']),dt[i]['info'],dt[i]['icon']};
						
						dtrow[i].push(Number(dt[i]['lat']));
						dtrow[i].push(Number(dt[i]['lng']));
						dtrow[i].push(dt[i]['info']);
						
						dtrow[i].push(dt[i]['icon']);
						//dtrow[i].push(dt[i]['univ_name']);
						//dtmap.push(dtrow[i]);
						//alert(dtmap);
						//alert(sv+'\n'+dt[i]['icon']+'\n'+ dt[i]['icon_pct']+'\n'+ dt[i]['info']);
						//alert(dtrow[i]);
						tph=tph+'{ID:'+i+', Name: "'+dt[i]['univ_name']+'"},';
						
						$('#tphsel').append('<option value="'+i+'">'+dt[i]['univ_name']+'</option>');
						cordtph[i]=[dt[i]['lat'],dt[i]['lng']];
					}
					
					tph = tph.replace('undefined', '');
					tph = tph.substring(0,tph.length - 1);
					//alert(tph);
					var tphtxt='$("#mapsrchvl").typeahead({autoSelect:false,source: ['+tph+'],displayField: "Name",valueField: "ID",limit:"20"});';
					
					eval(tphtxt);
				//var mrks=[];
				var mrkstr='var mrks=[';	var konf=[];var infwnd=[];
			
				for(var i=0;i<n;i++)
				{
					konf[i]=dt[i+1]['iconurl'];
					infwnd[i]=dt[i+1]['info'];
					mrkstr+='[{lat:'+dt[i+1]['lat']+',lng:'+dt[i+1]['lng']+'},"'+dt[i+1]['univ_name']+'"],';
					//alert(infwnd[i]);
				}
				mrkstr+='];';
				//alert(mrkstr);
				eval(mrkstr);
				
					if(Number($('.mfilter-country select').val())!=0)			
					{
						scale=Number(dtcntr[$('.mfilter-country select option:selected').val()]['scale']);
						crd=dtcntr[$('.mfilter-country select option:selected').val()]['cord'].split(',');
						coord={ lat: Number(crd[0]), lng: Number(crd[1]) };
						//alert(crd[0]);
					}
					else
					{
							switch ($('.mfilter-region select').val()) 
							{
							  case '0':
							    coord={ lat: 33, lng: 16.77 };
								scale=2;	
							    break;
							  case '1':
							    coord={ lat: 9.604317, lng: 17.823823 };
								scale=3;	
							    break;
							  case '2':
							    coord={ lat: 38.25898857820971, lng: 77.51449564808682 };
								scale=3;	
							    break;
							  case '3':
							    coord={ lat: 55.053202278679336, lng: 68.0712876284561 };
								scale=3;	
							    break;  
								case '4':
							    coord={ lat: -8.79822593747235, lng: -77.65136382423192 };
								scale=3;	
							    break;  
							    case '5':
							    coord={ lat: 57.49221340283756, lng: -118.08105372881057 };
								scale=3;	
							    break;  
							    case '6':
							    coord={ lat: -28.0591468595607, lng: 142.10785022041355 };
								scale=4;	
							    break;  
							  default:
							    coord={ lat: 33, lng: 16.77 };
								scale=2;	
							}
					}
                
                let pos = [coord.lat, coord.lng]; /// JSON.parse('['+record.data['cord']+']');
                pos = [pos[1], pos[0]];
                let city = ol.proj.fromLonLat(pos);
                
                window.mappanel.map.setView(new ol.View({
                  center: city,
                  zoom: scale, ///record.data['scale'] ?? 12,
                }));
                    
				const map = new google.maps.Map(document.getElementById("map_div"), {
				    zoom: scale ,
				    center: coord,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
			 	});	
				const tourStops = mrks;
                
                
			  // Create an info window to share between markers.
			  const infoWindow = new google.maps.InfoWindow();
				//var konf=['diamondw.png','goldw.png','silverw.png','bronzew.png','cooperw.png','worldw.png'];
				//alert(konf[2]);
			  // Create the markers.
			  tourStops.forEach(([position, title], i) => {
			  	//alert(position.lat);
			    const marker = new google.maps.Marker({
			      position,
			      map,
			      title: `#${i + 1} - ${title}`,
			      //label: `${i + 1}`,
			      icon:konf[i],
			      optimized: false,
			      cont:dt[i+1]['info']
			    });

			    // Add a click listener for each marker, and set up the info window.
			    marker.addListener("click", () => {
			      infoWindow.close();
			      //infoWindow.setContent(marker.getTitle());
			      infoWindow.setContent(marker.cont);
			      infoWindow.open(marker.getMap(), marker);
			    });
			    
			  });
					//alert(Number(n*4));
				    setTimeout(function(){
				    	$('#nwmap').css('display','none');
						$('#map_div').css('display','block');
						
					}, Number(n*4));
				}	
	  	 		else
				{
					$('.mapinfo').html('<div id="map_div"></div>');
					$('div.sweet-alert.showSweetAlert.visible').css('margin-top','-60%');
					swal("Please choose the different criteria.\nThe selected ranking type is limited by the number of participated institutions and there is no available data for the selected criteria.");
					/*$('.sweet-alert').css('margin-top',' -60%');
					$('div.sweet-overlay').css('display','none');
					$('.sweet-alert').css('border','1px solid #99CCFF');*/
					
					//alert('No!');
				}
				/*if(Number(cntr)==45)
					{alert(cntr);}*/
			}
			});	
		}
		else
		{
			
			var lt=Number(cordtph[$('#tphsel').val()][0]);
			var lg=Number(cordtph[$('#tphsel').val()][1]);
			zummap=Number(8);
			var unic=dt[$('#tphsel').val()]['icon'];
			var uninfo=dt[$('#tphsel').val()]['info'];
			var unnm=dt[$('#tphsel').val()]['univ_name'];
			var icnsrc='';
			var url = './images_rur/Konf/';
			if(Number(unnm.length)>0&$('#mapsrchvl').val()==unnm)
			{
				//alert(unnm+'\n'+unic +'\n'+dtrow[$('#tphsel').val()]); 
				//alert(dtrow[$('#tphsel').val()]); 
				//alert(uninfo);
				switch (unic)
				{
					case 'diamond':icnsrc=url+'diamondw.png';break;
		 			case 'gold':icnsrc=url+'goldw.png';break;
		 			case 'silver':icnsrc=url+'silverw.png';break;
		 			case 'bronze':icnsrc=url+'bronzew.png';break;
		 			case 'cooper':icnsrc=url+'cooperw.png';break;
		 			case 'world':icnsrc=url+'worldw.png';break;
		 			
				  	default:icnsrc=url+'worldw.png';
				}
					$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
				//if(Number(yr)<10){cntr=0;}
					const uluru = { lat: lt, lng: lg };
				  // The map, centered at Uluru
				  const map = new google.maps.Map(document.getElementById("map_div"), {
				    zoom: zummap,
				    center: uluru,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				  });
				  // The marker, positioned at Uluru
				  const marker = new google.maps.Marker({
				    position: uluru,
				    title:unnm,
				    icon:icnsrc,
				    cont:uninfo,
				    map: map,
				  });
				  const infoWindow = new google.maps.InfoWindow();
				  marker.addListener("click", () => {
				      infoWindow.close();
				      //infoWindow.setContent(marker.getTitle());
				      infoWindow.setContent(marker.cont);
				      infoWindow.open(marker.getMap(), marker);
				    });
			
			}
			else
			{
				$('#mapsrchvl').val('');
				$('div.sweet-alert.showSweetAlert.visible').css({'margin-top':'-60%','z-index':'99999'});
				swal('Please enter the name of the university in the search field.');	
				//initMap();
				$('.mapinfo').html('<div id="map_div"></div>');
				$('#mapsrchbtn').trigger( 'click');
			}
		
		
		}  		
	}
    window.initMap = initMap;
	function country_list()
	{
					sb=$('.mfilter-subject select option:selected').val();
					yr=$('.mfilter-year select option:selected').val();
					reg=$('.mfilter-region select option:selected').val();
					if(Number($('.mfilter-country select option:selected').val()))
					{cntr=$('.mfilter-country select option:selected').val();}
					else{cntr=0;}
					//alert(sb+'\n'+yr+'\n'+reg+'\n'+cntr);
					dtcntr=[];dtcntr.length=0;
					//var urlc='final/getunivdata_ymap.php?year='+yr+'&subj='+sb+'&reg='+reg+'&cntr='+cntr;
					var urlc='./final/getcntrdata_gmap22.php?year='+yr+'&subj='+sb+'&reg='+reg+'&cntr='+cntr;
					//alert(urlc);
					$('.mfilter-country select').html('<option value="0">World</option>');
					$.ajax(
					{
						url: urlc,
						success: function(data)
					 	{
					 		var j=0;
					 		var m=Number(data[2]);
					 		//alert(j+'\n'+m);
					 		$.each(data[1], function(key, val)
					 		{
								dtcntr[key]=[];
								//alert(key + '\n' + dtcntr[key]);
								$('.mfilter-country select').append('<option value="'+key+'">'+val['Country']+'</option>');
								
								dtcntr[key]['id_country']=val['id_country'];
								dtcntr[key]['Country']=val['Country'];
								dtcntr[key]['cord']=val['cord'];
								
								dtcntr[key]['scale']=val['scale'];
								dtcntr[key]['cntr_code']=val['cntr_code'];
								dtcntr[key]['cntr_iso']=val['cntr_iso'];
								dtcntr[key]['code_cntr']=val['code_cntr'];
								dtcntr[key]['code_reg']=val['code_reg'];
								//alert(key + '\n' + dtcntr[key]);
                                
							});
						}
		});
	}	
});
