/*window.onload = function () 
{
	country_list();
}*/
$(document).ready(function()
{
	var plmrk=[];	//Объект карты (используется в init)
	var hnt=[];		//Хинт метки - название вуза
	var cord=[];		//Координаты метки (вуза)
	var icn=[];		//Изображение метки (по лиге)
	var yr;var sb;var reg=0;var cntr=0;	//год, субъект, регион, страна - значения фильтров
	var myMap=Object;
	var n=0;				//кол-во вузов, отображаемых на карте
	var cntnt=[];	//html баллуна
	var dt=[];		//данные профиля вуза 
	var lnkprpf='';			//ссылка на профиль вуза
	var coord=[30, 0];			//координаты центра карты
	var zummap=2;			//zum карты
	var ctsmo=0;var ctsmn=0;//контрольные суммы
	var tph;				//текст массива вузов для typehead
	var tphcord=[];	//массив координат поиска
	var tphunnm=[];	//массив имен вузов поиска
	var cordtph=[];	//массив координат вузов по поиску
	var cntclk=0;			//количество повторных инициализаций карты
	//var wz=0;				//вариант размера окна
	//var ww=1020;			//текущий размер окна
	var dtcntr=[];	//массив данных стран
	var leftur='https://roundranking.com/universities/';	//корневой каталог профтлей вузов
	//var leftur='https://roundranking.com/universities/';
	$('.item-111').removeClass('active');
	$('.item-111').removeClass('carent');
	$('.item-110').addClass('active');
	country_list();
	subjectview();
	//$('#ctrvz').trigger('click');
	setTimeout(function(){$('#ctrvz').trigger('click');},200);
	
	$(document).on('click', '.main-nav li', function () 
	{
			$('.main-nav li').removeClass('active');
			$(this).addClass('active');
		});
	$(document).on('click', '.nav-btn', function () 
	{
			if ($('.main-nav').hasClass('show')) {
			  $('.main-nav').removeClass('show').slideDown();
			} else {
			  $('.main-nav').addClass('show').slideUp();
			}
			return false;
		});
	$(document).on('click', '#ctrvz', function (){
		zummap=2;
		$('#hdun').val('univ');
		//myMap.destroy();
		//alert(Number($('#region option:selected').val())+'\n'+Number($('#country option:selected').val())+'\n'+dtcntr[$('#country option:selected').val()]['cord']);
		if(Number($('#region option:selected').val())!==0)
		{
				switch ($('#region').val()) 
				{
				  case '0':
				    coord=[30, 0];
					zummap=2;	
				    break;
				  case '1':
				    coord=[9.604317, 17.823823];
					zummap=3;	
				    break;
				  case '2':
				    coord=[38.25898857820971, 77.51449564808682];
					zummap=3;	
				    break;
				  case '3':
				    coord=[55.053202278679336, 68.0712876284561];
					zummap=3;	
				    break;  
					case '4':
				    coord=[-8.79822593747235, -77.65136382423192];
					zummap=3;	
				    break;  
				    case '5':
				    coord=[57.49221340283756, -118.08105372881057];
					zummap=3;	
				    break;  
				    case '6':
				    coord=[-28.0591468595607, 142.10785022041355];
					zummap=4;	
				    break;  
				  default:
				    coord=[30, 0];
					zummap=2;
				}
			}

		if(Number($('#country option:selected').val())!==0)
		{
			var crdcntr=dtcntr[$('#country option:selected').val()]['cord'].split(',');
			
			coord=[crdcntr[0],crdcntr[1]];
			zummap=dtcntr[$('#country option:selected').val()]['scale'];
			//alert($('#country option:selected').val()+'\n'+ coord+'\n'+  zummap);
		}
		setTimeout(function(){setmap();},200);
		//alert(coord+'\n'+zummap);
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
	});
	$(document).on('change', '#country', function () {
		$('#hdun').val(0);
		$('#map').html('');
		$('.mpsrch').css('display','none');
		cntclk=0;
		
		//setTimeout(function(){$('#ctrvz').removeAttr('disabled');$('.mapinfo').append('<div id="map"></div>') ;},500);
	});
	$(document).on('change', '#region', function () {
		$('#country').html('<option value="0">Word</option>');
		$('#hdun').val(0);
		$('#map').html('');
		$('.mpsrch').css('display','none');
		cntclk=0;
		//setTimeout(function(){country_list();},400);
		country_list();
		setTimeout(function(){$('#ctrvz').removeAttr('disabled');},1000);
	});
	$(document).on('change', '#subj', function () {
		$('#country').html('<option value="0">Word</option>');
		$('.mpsrch').css('display','none');
		cntclk=0;
		$('#hdun').val(0);
		$('#map').html('');
		country_list();
		setTimeout(function(){$('#ctrvz').removeAttr('disabled');},1000);
	});
	$(document).on('click', '.point', function () {
	if (!$(this).hasClass('disabled'))
	{
		$('.point').removeClass('active');
		$(this).addClass('active');
	}
	$('#country').html('<option value="0">Word</option>');
	$('#map').html('');
	$('#hdun').val(0);
	$('.mpsrch').css('display','none');
	subjectview();
	country_list();
	setTimeout(function(){$('#ctrvz').removeAttr('disabled');},1000);
	cntclk=0;
	return false;
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
		if(Number($('#mapsrchvl').val().length)>0)
		{
			coord=cordtph[$('#tphsel :contains("' +$('#mapsrchvl').val() + '")').val()];
			zummap=16;
			myMap.setCenter(coord, 16, {
	    		checkZoomRange: true
			});
		}
		else
		{
			$('div.sweet-alert.showSweetAlert.visible').css({'margin-top':'-60%','z-index':'99999'});
				swal('Please enter the name of the university in the search field.');	
		}
	});
	function setmap()
	{	
	//alert($('#subj option:selected').val());
	sb=$('#subj option:selected').val();
	yr=Number($('.point.active .point-text').text()-2009);
	reg=$('#region option:selected').val();
	cntr=$('#country option:selected').val();
	//yr
	var ur='final/getunivdata_ymap.php?year='+yr+'&subj='+sb+'&cntr='+cntr+'&reg='+reg;
	//alert(ur);
	/*if(Number(cntr)==0)
	{leftur='https://roundranking.com/universities/';hs='';}
	else
	{
		leftur='https://roundranking.com/cntr_profil/';
		hs='&cntr='+cntr;
		sb=0;
	}
	*/
	$('#mapsrchvl').val('');
//$("div.content").empty()
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
				dt.length=0;
				ctsmn=Number(n);
				ctsmo=Number($('#hdun').val());
				tph='';
				$('#mapsrchvl').typeahead('destroy');
				$('#tphsel').html('');
  	 			for(var i=1;i<=n;i++)
  	 			{
  	 				dt[i]=new Array;
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
						case 'Diamond League':dt[i]['icon']='images_rur/Konf/diamondw.png';break;
			 			case 'Golden League':dt[i]['icon']='images_rur/Konf/goldw.png';break;
			 			case 'Silver League':dt[i]['icon']='images_rur/Konf/silverw.png';break;
			 			case 'Bronze League':dt[i]['icon']='images_rur/Konf/bronzew.png';break;
			 			case 'Copper League':dt[i]['icon']='images_rur/Konf/cooperw.png';break;
			 			case 'World League':dt[i]['icon']='images_rur/Konf/worldw.png';break;
					  	default:dt[i]['icon']='images_rur/Konf/worldw.png';
					}
					
					lnkprpf=leftur+dt[i]['nm_page']+'.html?sort=O&subject='+sv+'&year='+Number(yr+2009);
					
					cntnt[i]='<div style="position: relative; display: block; width: 580px;height: 400px; margin: auto;overflow-y: auto;"><table style="font-family:arial;width:auto;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr><td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'+dt[i]['logo']+'" style="vertical-align:top" height="135" width="135"></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color:'+dt[i]['O_Color1']+';font-size:17px"><strong>'+dt[i]['univ_name']+'</strong></span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['found']+'</span></td><td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'+dt[i]['flag']+'" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color:'+dt[i]['O_Color1']+'"><strong></strong></span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['sh_nm']+'</span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['type']+'</span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['Students']+'</span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['Faculty']+'</span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'+dt[i]['website']+'" target="_blank">'+dt[i]['website']+'</a></span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['region']+'</span></td></tr><tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+dt[i]['loc']+'</span></td></tr><tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top:'+dt[i]['O_Color1']+' 2px solid"></td><td></td></tr><tr><td style="font-family:arial;width:114px;text-align:center" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'+dt[i]['O_80p']+'" style="width:80px;height:80px" alt=""><br><div style="font-family:arial;color:#fff;font-size:14pt;font-weight:bold;padding-top:25px">'+dt[i]['O_WR']+'</div></div><div style="font-family:arial;width:80px"><strong><span style="color:'+dt[i]['O_Color1']+'"><span style="font-size:13pt">'+dt[i]['O_WR']+'</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color:'+dt[i]['O_Color1']+'"><span style="font-size:13pt">'+dt[i]['League']+'</span></span></strong></div></td><td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color:'+dt[i]['O_Color1']+'"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color:'+dt[i]['O_Color1']+'"><strong>'+dt[i]['O_CR']+'</strong></span></span></p></td></tr><tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top:'+dt[i]['O_Color1']+' 2px solid"></td><td></td></tr><tr style="font-family:arial;background:'+dt[i]['O_Color4']+';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'+dt[i]['O_O_s']+'" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_WR']+'</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_WS']+'</span></td></tr><tr style="font-family:arial;height:20px;background:'+dt[i]['T_Color4']+'"><td style="font-family:arial;width:50px"><img alt="" src="'+dt[i]['T_Os']+'" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+dt[i]['O_TR']+'</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+dt[i]['O_TS']+'</span></td></tr><tr style="font-family:arial;background:'+dt[i]['R_Color4']+'"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'+dt[i]['R_Os']+'" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_RR']+'</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_RS']+'</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color:#999999"><a href="'+lnkprpf+'" target="_blank">View full university profile</a></span></span></td></tr><tr style="font-family:arial;height:26px;background:'+dt[i]['I_Color4']+'"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'+dt[i]['I_Os']+'" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_IR']+'</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_IS']+'</span></td></tr><tr style="font-family:arial;background:'+dt[i]['F_Color4']+';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'+dt[i]['F_Os']+'" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_FR']+'</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+dt[i]['O_FS']+'</span></td></tr></tbody></table></div>';
				//alert(cntnt[i]);
				tph=tph+'{ID:'+i+', Name: "'+dt[i]['univ_name']+'"},';
				$('#tphsel').append('<option value="'+i+'">'+dt[i]['univ_name']+'</option>');
				cordtph[i]=[dt[i]['lat'],dt[i]['lng']];
				}
				tph = tph.replace('undefined', '');
				tph = tph.substring(0,tph.length - 1);
				//alert(tph);	
				$('#hdun').val(n);
				var tphtxt='$("#mapsrchvl").typeahead({autoSelect:false,source: ['+tph+'],displayField: "Name",valueField: "ID",limit:"20"});';
				//$("#mapsrchvl").typeahead({autoSelect:false,source: [{ID:1, Name: "Aalborg University"},{ID:2, Name: "Aalto University"}],displayField: "Name",valueField: "ID",limit:"20"});
				
				eval(tphtxt);
				setTimeout(function(){ymaps.ready(init);		
				init();},500);
	function init()
	{
	for(var i=1;i<=n;i++)
	{
		//alert(dt[i]['univ_name']);
		plmrk[i] = new ymaps.Placemark([dt[i]['lat'], dt[i]['lng']], {
            balloonContent: cntnt[i],
            hintContent:dt[i]['univ_name'],
        }, {
            iconLayout: 'default#image',
            iconImageHref:dt[i]['icon'],
            iconImageSize: [15, 20],
            iconImageOffset: [-8, -10],
           balloonMinWidth: 580,
         	balloonMinHeight: 380,
         	balloonPanelMaxHeightRatio:0.8,
          //balloonOffset:-150,
           balloonAutoPanCheckZoomRange:true,
           balloonAutoPan:true
        });
	}
	$('#map').html('');
	//ymaps.destroy();
	//if(Number($('#country option:selected').val())!=0){alert(coord[0]+'\n'+coord[1]+'\n'+zummap);}
    myMap = new ymaps.Map('map', {
            center: coord,
            zoom: zummap
        });
 	myMap.controls.remove('searchControl');
 	myMap.controls.remove('geolocationControl');
 	myMap.controls.remove('trafficControl');
 	myMap.controls.remove('typeSelector');
 	myMap.controls.remove('rulerControl');
        var ev='myMap.geoObjects';
		for(var j=1;j<=n;j++)
		{
			ev+='.add(plmrk['+j+'])';
		}
		eval(ev);
		
		var rslt=myMap.geoObjects.getLength();
		//if(Number($('#country option:selected').val())!=0){alert(rslt+'\n'+n+'\n'+coord+'\n'+zummap);}
		if(Number(rslt)==Number(n))
		{
			//$('.emptmap').css('display','none');
			$('#map').css('display','block');
			$('.mpsrch').css('display','block');
		}
		else
		{
			$('#map').css('display','none');
			$('.mpsrch').css('display','none');
			$('#ctrvz').trigger('click');
		}
	
		
}
		
			}
			else
			{
				$('div.sweet-alert.showSweetAlert.visible').css('margin-top','-60%');
				swal('There is no data for the specified set of filters.\nPlease define a different set.');
				$('#country option[value=0]').prop('selected', true);
				coord=[30, 0];
				zummap=2;
			}
		}
	});
	
}
	function subjectview()
	{
		
		yr=Number($('.point.active .point-text').text())-2009;
		//alert(yr);
		if(Number(yr)<5||Number(yr)==12)
		{
			if(yr<5)
			{
				$('.az-sort-by-s option[value="2"]').remove();
				$('.az-sort-by-s option[value="3"]').remove();
				$('.az-sort-by-s option[value="4"]').remove();
				$('.az-sort-by-s option[value="5"]').remove();
				$('.az-sort-by-s option[value="6"]').remove();
				$('.az-sort-by-s option[value="7"]').remove();
				$('.az-sort-by-s option[value="1"]').attr('selected',true);
			}
			else
			{
				//$('.az-sort-by-s option[value="2"]').remove();
				//$('.az-sort-by-s option[value="3"]').remove();
				//$('.az-sort-by-s option[value="4"]').remove();
				//$('.az-sort-by-s option[value="5"]').remove();
				//$('.az-sort-by-s option[value="6"]').remove();
				//$('.az-sort-by-s option[value="7"]').remove();
				//$('.az-sort-by-s option[value="1"]').attr('selected',true);
			}
		}
		else
		{
			if(!$('.az-sort-by-s option[value="2"]').val())
            {$('.az-sort-by-s').append('<option value="2">Humanities</option>');}
			if(!$('.az-sort-by-s option[value="3"]').val())
            {$('.az-sort-by-s').append('<option value="3">Life Sciences</option>');}
            if(!$('.az-sort-by-s option[value="4"]').val())
            {$('.az-sort-by-s').append('<option value="4">Medical Sciences</option>');}
            if(!$('.az-sort-by-s option[value="5"]').val())
            {$('.az-sort-by-s').append('<option value="5">Natural Sciencest</option>');}
            if(!$('.az-sort-by-s option[value="6"]').val())
            {$('.az-sort-by-s').append('<option value="6">Social Sciences</option>');}
            if(!$('.az-sort-by-s option[value="7"]').val())
            {$('.az-sort-by-s').append('<option value="7">Technical Sciences</option>');}
            
		}
	}
	function country_list()
	{
		sb=$('#subj option:selected').val();
		yr=Number($('.point.active .point-text').text()-2009);
		reg=$('#region option:selected').val();
		cntr=$('#country option:selected').val();
		var urlc='final/getunivdata_ymap.php?year='+yr+'&subj='+sb+'&reg='+reg+'&cntr='+cntr;
		//alert(urlc);
		
		$.ajax(
		{
			url: urlc,
			success: function(data)
		 	{
		 		var j=0;
		 		var m=Number(data[2]);
		 		//alert(j+'\n'+m);
		 		$.each(data[3], function(key, val)
		 		{
					dtcntr[key]=new Array;
					$('#country').append('<option value="'+key+'">'+val['Country']+'</option>');
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
		 		/*
		 		forearch(data[3])
		 		{
					dtcntr[j]=new Array;
					$('#country').append('<option value="'+data[3][j]['id_country']+'">'+data[3][j]['Country']+'</option>');
					dtcntr[j]['id_country']=data[3][data[3][j]['id_country']]['id_country'];
					dtcntr[j]['Country']=data[3][data[3][j]['id_country']]['Country'];
					dtcntr[j]['cord']=data[3][data[3][j]['id_country']]['cord'];
					dtcntr[j]['scale']=data[3][data[3][j]['id_country']]['scale'];
					dtcntr[j]['cntr_code']=data[3][data[3][j]['id_country']]['cntr_code'];
					dtcntr[j]['cntr_iso']=data[3][data[3][j]['id_country']]['cntr_iso'];
					dtcntr[j]['code_cntr']=data[3][data[3][j]['id_country']]['code_cntr'];
					dtcntr[j]['code_reg']=data[3][data[3][j]['id_country']]['code_reg'];
					//alert($('#country').html());
				}
		 		*/
			}
		});
	}

});