try {
var YYRR;
var profdat=Array;
var undt=Array;
var unmlnk='california-institute-of-technology-caltech';

let wasClickedTrigger = 0;
let ti = null;
let lastMissed = 0;
let missedCount = 0;
window.lastWindowCoord = null;

(function ($) 
{
    let container = null;
    let content = null;

    /**
     * theScript - the js url or js function, which you want to require in head.
     * (js url will be included; js function will be called in special way.)
     * async - usually you want sync require, default false (preserving order)
     */
    window.requireJS2H = function requireJS2H (theScript, async) {
        const isFunction = function (value) {return !!value && !/^\s*class/.test(value.toString()) && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function) };
        if (!theScript || '' == theScript) {
            throw new Error('theScript required');
        } else {
            if (isFunction(theScript)) {
                theScript = theScript.toString();
                if (theScript.indexOf('//') >= 0 || theScript.indexOf('/*') >= 0 || theScript.indexOf('*/') >= 0 || theScript.indexOf('[native code]') >= 0 || theScript.indexOf('eval') >= 0 || theScript.indexOf('Function') >= 0) {
                    throw new Error('Sorry, for security reasons your func must not have inner comments nor native code nor eval. If it is wrong, just split string by parts.');
                }
                theScript = ';((' + theScript + ').bind(this))' + '();'; // you can probe without bind too
                console.log('[WARN] Require js by code: \n ', theScript); //
                theScript = 'data:text/javascript,' + encodeURIComponent(theScript);
            } else if (!Array.isArray(theScript) && !!theScript.length && !!isFunction(theScript.toUpperCase)) {
                if (theScript.indexOf('{') >= 0 || theScript.indexOf('}') >= 0 || theScript.indexOf('(') >= 0 || theScript.indexOf(')') >= 0) {
                    throw new Error('Function means funciton, but not the text of function!');
                }
            } else {
                throw new Error('theScript can be only js function or js url');
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.async = !!async; // TODO promise chain when async
            script.src = '' + theScript;
            document.getElementsByTagName('head')[0].appendChild(script);                
        }
    }
    
    window.requireCSS2H = function requireCSS2H (theStyle, styleType) {
        if (!theStyle || '' == theStyle) {
            throw new Error('theStyle required');
        } else {
            if (!Array.isArray(theStyle) && !!theStyle.length) {
                if ((theStyle.indexOf('//') >= 0 && theStyle.indexOf('https://') < 0 && theStyle.indexOf('http://') < 0) || theStyle.indexOf('/*') >= 0 || theStyle.indexOf('*/') >= 0 || theStyle.indexOf('[native code]') >= 0 || theStyle.indexOf('eval') >= 0 || theStyle.indexOf('Function') >= 0) {
                    throw new Error('Sorry, for security reasons your style must not have inner comments nor native code nor eval. If it is wrong, just split string by parts.');
                }
                if (theStyle.indexOf('{') >= 0 || theStyle.indexOf('}') >= 0 || theStyle.indexOf('(') >= 0 || theStyle.indexOf(')') >= 0) {
                    theStyle = 'data:text/css,' + encodeURIComponent(theStyle);
                }
            } else {
                throw new Error('theStyle can be only css text or css url');
            }
            var script = document.createElement('link');
            script.type = "text/css";
            script.rel = !!styleType ? styleType : "stylesheet";
            script.href = '' + theStyle;
            document.getElementsByTagName('head')[0].appendChild(script);                
        }
    }
    
    window.rndStr = function (randomStringPrefix = 't') {
        if (!randomStringPrefix || Array.isArray(randomStringPrefix) || !randomStringPrefix.length || !(typeof randomStringPrefix === 'string' || randomStringPrefix instanceof String)) {
            randomStringPrefix = 'tn_';
        }
        return '' + randomStringPrefix + ((Math.random() + 5) * (new Date().getSeconds() + 2) / 10 % 2 + 3).toString(36).substring(4);
    }
    
    if (!window.ol || !ol.View) {
        let script = null;
        
        requireJS2H("/deps/ext-6.2.0/build/ext-min.js");
        
        requireCSS2H("/deps/ext-6.2.0/build/classic/theme-gray/resources/theme-gray-all.css?k=" + rndStr());
        
        requireJS2H("/deps/es6-shim-polyfill.es5.js");
        requireJS2H("/templates/rur/js/bootstrap-typeahead.js?k=" + rndStr());
        
        requireJS2H("/deps/ol.js");
        
        requireCSS2H("/deps/ol.css?k=" + rndStr());
    }
    
    requireJS2H(function () {
        jQuery(document).ready(function () {
            try {
                requireCSS2H('button.filter-select-arrow {display: inline-block }');
            } catch (e6y745454624743) {
                jQuery('button.filter-select-arrow').css({"display": 'inline-block' });
            }
        })
    });
    
	$.format3dight = function (value) {
		return value.split(',').join('.').toFixed(3).toString().split('.').join(',');
	}
	$.getParameterByName = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
$(document).ready(function () {
		//alert(document.baseURI);
		//$.gmap3({key: 'AIzaSyBzEr0UCQ2hxfjk_GcaCXS-9TkyGaoD7-o'});
		getunivnm();
		insmodal();
		// $('.d11 label').after('<span class="jQtooltip mini" id="tlp_univ_nm"  title="Start typing the name of the university or choose it from the drop down list by clicking on the triangle mark in the right side of this panel."><b>?</b></span>'); 
		// $('.col-md-3.ptb5 label').after('<span class="jQtooltip mini" id="tlp_univ_rnk"  title="Select one of four RUR Rankings: Teaching, Research, International Diversity, Financial Sustainability."><b>?</b></span>'); 
		// $('.col-md-2.ptb5 label').after('<span class="jQtooltip mini" id="tlp_univ_sbj"  title="Select one of four RUR Subjects: Humanities, Life Sciences, Medical Sciences, Natural Sciences, Social Sciences, Technical Sciences."><b>?</b></span>');
		// $('.col-md-1.ptb10 button').after('<span class="jQtooltip mini" id="tlp_univ_shw"  title="Click here to display university profile."><b>?</b></span>');
		// $('.col-md-1.ptb10 input').after('<span class="jQtooltip mini" id="tlp_univ_prt"  title="Click here to print university profile for selected year/ranking."><b>?</b></span>');
		// $('.btnsave input').after('<span class="jQtooltip mini" id="tlp_univ_sav"  title="Select the format to save the profile of the university."><b>?</b></span>');
			if(window.location.search)
			{
					//alert('year');
					if($.getParameterByName('highlight'))
					{
						/*$('.point').removeClass('active');
						$('.point:contains("2022")').addClass('active');*/
						$('#years option:selected').each(function(){$(this).removeAttr('selected');});
						$('#years option:contains("'+$.getParameterByName('year')+'")').prop('selected', true);
					}
					if($.getParameterByName('univ'))
					{$('#university-name').val($.getParameterByName('univ'));}
					if($.getParameterByName('subject'))
					{$('#subj [value="'+$.getParameterByName('subject') +'"]').attr("selected", "selected");}
					if($.getParameterByName('sort'))
					{$('#dimrank [value="'+$.getParameterByName('sort') +'"]').attr("selected", "selected");}
					if($.getParameterByName('year'))
					{
						//$('.point').removeClass('active');
						//alert($.getParameterByName('year'));
						$('#years option:selected').each(function(){$(this).removeAttr('selected');});
						//$('.point:contains("'+$.getParameterByName('year')+'")').addClass('active');
						$('#years option:contains("'+$.getParameterByName('year')+'")').prop('selected', true);
					}
				//setTimeout(function(){ $( "#search-university" ).trigger( "click" );}, 700);
			}
			else
			{
					$('#years option:contains("2022")').prop('selected', true);
					var pn=String(window.location.pathname).split('/')[2];
					if(pn!='universitiess.html')
					{window.location.search='?sort=O&year=2022&subject=SO';}
			}	
		setTimeout(function(){getunnm();}, 300);
		setTimeout(function()		{
        document.getElementById("search-university").click();
        },400);
		setTimeout(function(){$('#prntr').removeAttr('disabled'); }, 700);
		$(window).resize(function() 
		{
			//viewpoint();	
			$("select.az-univers-sel.form-control.az-univers-lst").change();
		});
		$(document).on('click', '.prntrepr', function (){
			$('.svwnd').css('display','none');
			datatoprint();
		});
		$(document).on('click', '.savrepr', function (){
			// $('.svwnd').css('display','block');
			$('.svwnd .save_to_pdf').click();
		});
		$(document).on('click', '.save_to_pdf', function (){
			datatopdf();
			$('.svwnd').css('display','none');
		});	
		$(document).on('click', '.save_to_doc', function (){
			datatodoc();
			$('.svwnd').css('display','none');
		});	
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
		$(document).on('change', '#years', function ()
		{
			subjectview();
			getunnm();
			$('#hdyr').val($('#years option:selected').text());
			$('.d3').html('');
			$('.page-header').css('border-bottom','none');
          	make_loc();
			setTimeout(function(){$('#search-university').click();},200);
			return false;
		});

		$(document).on('change', '.az-subject-sort', function ()
		{
			$('.d3').html('');
			$('#search-university').removeClass('active');
			$('.page-header').css('border-bottom','none');
			getunnm();
          	make_loc();
			setTimeout(function(){$('#search-university').click();},200);
		});
		$(document).on('change', '#dimrank', function ()
		{
			$('.d3').html('');
			$('#search-university').removeClass('active');
			$('.page-header').css('border-bottom','none');
          	make_loc();
			setTimeout(function(){$('#search-university').click();},200);
		});	
		$(document).on('click', '#university-name', function ()
		{
			$('#university-name').val('');
			$('#university-name').prop('placeholder','');
			$('.page-header').css('border-bottom','none');
			$('#prntr').attr('disabled','disabled');
			
		});
		$(document).on('change', '#university-name', function ()
		{
			getunlnk($.trim($('#university-name').val()));
          	$('#search-university').attr('disabled',true);
          	$('#selun option:selected').each(function(){$(this).removeAttr('selected');});
          	setTimeout(function(){
			$('#selun option:contains('+$.trim($('#university-name').val())+')').attr('selected', 'selected');
			$('.d3').html('');
        	$('#search-university').removeAttr('disabled');
        	make_loc();
        	}, 200);
          	//setTimeout(function(){make_loc();},1000);
			setTimeout(function(){$('#search-university').click();},300);
		});
        $(document).on('change', '#pglnk', function ()
        {
          make_loc();
        });  
		$(document).on('change', '#selun', function ()
		{			
			
			$('#university-name').val('');
			$('#university-name').prop('placeholder','');
			$('#university-name').val($('#selun :selected').text());
			getunlnk($.trim($('#university-name').val()));
			$('.page-header').css('border-bottom','none');
			$('#prntr').attr('disabled','disabled');
			$('.d3').html('');
          	make_loc();
			setTimeout(function(){$('#search-university').click();},200);
		});
		$(document).on('click','.filter-btn', function(){
		$(this).toggleClass('active');
		$(this).siblings('.filter-item:not(:first-child)').slideToggle();
	});
	$(document).on('click', '#search-university', function ()
	{
		
		$('.svwnd').css('display','none');
				subjectview();	
				//alert('head   '+$('.page-header h1').text()+'\n'+'unnm   '+$('#university-name').val());
				if($.trim($('.page-header h1').text())!=$.trim($('#university-name').val()))
				{
					
					var lnkadr='';
					var	vars = $(location).attr('href').split('/');
					for(var i=0;i<vars.length-1;i++)
					{lnkadr+=vars[i]+'/';}
					
					getunlnk($.trim($('#university-name').val()));
					setTimeout(function()
					{
						var alis=$('#pglnk').html();
						//alert(alis);
						var lnkproph=lnkadr+alis+'.html'+'?sort='+$('#dimrank').val()+'&year='+$('#years option:selected').text()+'&subject='+$('#subj').val();
						//alert($('#listunnm option:contains('+$('#university-name').val()+')').val()+'\n'+alis);
					 	if($('#listunnm option:contains('+$('#university-name').val()+')').val()&&alis!='')
						{$(location).attr('href',lnkproph);}
						else
						{
							var pn=String(window.location.pathname).split('/')[2];
							if(pn!='universitiess.html')
							{
								swal("No educational institution with such name was found.");
								$('div.sweet-overlay').css('display','none');
								$('.sweet-alert').css('border','1px solid #99CCFF');
							}
						}
					},400);
				}
			else
			{
			
			$('#prntr').removeAttr('disabled');
			$('.d3').css('display','block');
			$('#footer').css('display','block');
			var t = "https://fusiontables.googleusercontent.com/fusiontables/embedviz?viz=CARD&q=select+*+from+[tbl]+where+col0+%3D+%27[univ]%27&tmplt=4&cpr=1";
			var univ = $('#university-name').val().split('%q%').join('&#39;').split(' ').join('+');
			var sdt=$('#years option:selected').text();
			var ssbj=$('#subj :selected').text();
			if(ssbj=='All Subjects'){ssbj='Overall';}
			ssbj=encodeURIComponent(ssbj);
			var sdtunnm=encodeURIComponent($('#university-name').val());
			var cntr=$('#cntr :selected').val();
			var urldt='/final/isdatauniv17.php?year='+sdt+'&subj="'+ssbj+'"'+'&unnm="'+sdtunnm+'"';
			//alert(urldt);
			$.getJSON(urldt, function(data)
				//			{if(Number(data)>0)
				{
					if((data))
					{
						getundata(sdt,ssbj,sdtunnm);
					}
					else
					{
						$('.d3').css('display','none');
						swal("This university did not provide the data for selected year/ranking/subject or selected ranking hasn't been published yet");                        $('div.sweet-overlay').css('display','none');
						$('.sweet-alert').css('border','1px solid #99CCFF');
					}
				});
		function getundata(sdt,ssbj,sdtunnm)
		{
		var urlundt='../final/getunivdata20.php?year='+sdt+'&subj='+ssbj+'&unnm='+sdtunnm;
		//alert(urlundt);
		$('#hdyr').val(urlundt);
		$('.d3').html('');
		var htkd='';
		
		$.getJSON(urlundt, function(data)
		{
			
				if(data['website'].substring(0, 4)!='http')
				{undt['website']='http://'+data['website'];}
				else{undt['website']=data['website'];}
				
				/*
          		if(Number(sdt)>2021)
                {
                 	if(Number(data['O_WR'])>1000)
					{undt['O_WR']='1001-1100';}
					else
					{
						if(Number(data['O_WR'])>900)
						{undt['O_WR']='901-1000';}
						else
						{
							if(Number(data['O_WR'])>800)
							{undt['O_WR']='801-900';}
							else{undt['O_WR']=data['O_WR'];}
						}
					}
                }
          		else{undt['O_WR']=data['O_WR'];}
                */
                
                
                
          		undt['O_WR']=data['O_WR'];
				undt['O_WS']=data['O_WS'];undt['O_CR']=data['O_CR'];
				undt['O_Color1']=data['O_Color1'];undt['O_80p']=data['O_80p'];undt['O_OL']=data['O_OL'];
				undt['O_O_s']=data['O_O_s'];undt['O_Color4']=data['O_Color4'];undt['O_Color3']=data['O_Color3'];
				/*
				if(Number(sdt)>2021)
                {
                  if(Number(data['O_TR'])>1000)
                  {undt['O_TR']='1001-1100';}
                    else
                    {
                        if(Number(data['O_TR'])>900)
                        {undt['O_TR']='901-1000';}
                        else
                        {
                            if(Number(data['O_TR'])>800)
                            {undt['O_TR']='801-900';}
                            else{undt['O_TR']=data['O_TR'];}
                        }
                    }
                }
          		else{undt['O_TR']=data['O_TR'];}
          		*/
          		undt['O_TR']=data['O_TR'];
				undt['O_TS']=data['O_TS'];undt['T_CR']=data['T_CR'];
				undt['T_Color1']=data['T_Color1'];undt['T_80p']=data['T_80p'];undt['O_TL']=data['O_TL'];
				undt['T_Ts']=data['T_Ts'];undt['T_Color4']=data['T_Color4'];undt['T_Color3']=data['T_Color3'];
				
				/*
         		if(Number(sdt)>2021)
                {
                  if(Number(data['O_RR'])>1000)
                  {undt['O_RR']='1001-1100';}
                  else
                  {
                      if(Number(data['O_RR'])>900)
                      {undt['O_RR']='901-1000';}
                      else
                      {
                          if(Number(data['O_RR'])>800)
                          {undt['O_RR']='801-900';}
                          else{undt['O_RR']=data['O_RR'];}
                      }
                  }
                }
          		else{undt['O_RR']=data['O_RR'];}
          		*/
          		undt['O_RR']=data['O_RR'];
				undt['O_RS']=data['O_RS'];undt['R_CR']=data['R_CR'];
				undt['R_Color1']=data['R_Color1'];undt['R_80p']=data['R_80p'];undt['O_RL']=data['O_RL'];
				undt['R_Rs']=data['R_Rs'];undt['R_Color4']=data['R_Color4'];undt['R_Color3']=data['R_Color3'];
				/*
          		if(Number(sdt)>2021)
                {
                  if(Number(data['O_IR'])>1000)
                  {undt['O_IR']='1001-1100';}
                  else
                  {
                      if(Number(data['O_IR'])>900)
                      {undt['O_IR']='901-1000';}
                      else
                      {
                          if(Number(data['O_IR'])>800)
                          {undt['O_IR']='801-900';}
                          else{undt['O_IR']=data['O_IR'];}
                      }
                  }
                }
          		else{undt['O_IR']=data['O_IR'];}
          		*/
          		undt['O_IR']=data['O_IR'];
				undt['O_IS']=data['O_IS'];undt['I_CR']=data['I_CR'];
				undt['I_Color1']=data['I_Color1'];undt['I_80p']=data['I_80p'];undt['O_IL']=data['O_IL'];
				undt['I_Is']=data['I_Is'];undt['I_Color4']=data['I_Color4'];undt['I_Color3']=data['I_Color3'];
				/*
				if(Number(sdt)>2021)
                {
                  if(Number(data['O_FR'])>1000)
                  {undt['O_FR']='1001-1100';}
                  else
                  {
                      if(Number(data['O_FR'])>900)
                      {undt['O_FR']='901-1000';}
                      else
                      {
                          if(Number(data['O_FR'])>800)
                          {undt['O_FR']='801-900';}
                          else{undt['O_FR']=data['O_FR'];}
                      }
                  }
                }
          		else{undt['O_FR']=data['O_FR'];}
          		*/
          		undt['O_FR']=data['O_FR'];
				undt['O_FS']=data['O_FS'];undt['F_CR']=data['F_CR'];
				undt['F_Color1']=data['F_Color1'];undt['F_80p']=data['F_80p'];undt['O_FL']=data['O_FL'];
				undt['F_Fs']=data['F_Fs'];undt['F_Color4']=data['F_Color4'];undt['F_Color3']=data['F_Color3'];
				//undt['avr_bak']=data['avr_bak'];undt['avr_mag']=data['avr_mag'];
				//alert(undt['avr_bak']+' '+undt['avr_mag']);
				var hre = data['univ_name'];
	        var strh = data['nm_page'];
//	        alert (strh);
		    var ow_r;var ow_s;
		    
		    var dtrnk=Array;
	
			for(var i=1;i<=20;i++)
		    {
		    	$('#pind'+i).text(data['IR'+i]);
		    	$('#pindsc'+i).text(data['O_I'+i]);
		    }
			if(!(data['wrr'])){data['wrr']='-';}
		    if(!(data['wsr'])){data['wsr']='-';}
			if(!(data['wrp'])){data['wrp']='-';}
		    if(!(data['wsp'])){data['wsp']='-';}
		    
		    if(!(data['avr_bak'])){data['avr_bak']='-';}
		    if(!(data['avr_mag'])){data['avr_mag']='-';}
		
				var ltsbj='a';			
				switch (data['subj'])
				{
			  	case ('Overall'):ltsbj='a';break;
				case ('Humanities'):ltsbj='h';break;
				case ('Life Sciences'):ltsbj='l';break;
				case ('Medical Sciences'):ltsbj='m';break;
				case ('Natural Sciences'):ltsbj='n';break;
				case ('Social Sciences'):ltsbj='s';break;
				case ('Technical Sciences'):ltsbj='t';break;
				default:ltsbj='a';
				}
				var studnt;var faclty;
/*if(Number(sdt)>2017)
{
	studnt=data['stud'].toFixed(0);
	faclty=data['fac'].toFixed(0);
}
else
{*/
	studnt=data['stud'].toFixed(0);
	faclty=data['fac'].toFixed(0);
//}          
	
          
 	var sblgimg='';
	var sblg=data['subj'];
	
	switch (data['subj'])
	{
	case ('Humanities'):sblgimg='Ar';break;
	case ('Life Sciences'):sblgimg='Li';break;
	case ('Medical Sciences'):sblgimg='Me';break;
	case ('Natural Sciences'):sblgimg='Ph';break;
	case ('Social Sciences'):sblgimg='So';break;
	case ('Technical Sciences'):sblgimg='En';break;
	default:sblgimg='Ov';
	} 
	
 	var imscr_T_20='';
 	var imscr_R_20='';
 	var imscr_I_20='';
 	var imscr_F_20='';
 	
 	switch (data['O_TL'])
	{
  	case ('Diamond League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Diam_20_T.png';break;
	case ('Golden League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Gold_20_T.png';break;
	case ('Silver League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Silv_20_T.png';break;
	case ('Bronze League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Bron_20_T.png';break;
	case ('Copper League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Copp_20_T.png';break;	
	case ('World League'):imscr_T_20='../images_rur/rurd/'+sblgimg+'_Ov_Worl_20_T.png';break;	
	default:	imscr_T_20='';				
	}
	switch (data['O_RL'])
	{
  	case ('Diamond League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Diam_20_R.png';break;
	case ('Golden League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Gold_20_R.png';break;
	case ('Silver League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Silv_20_R.png';break;
	case ('Bronze League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Bron_20_R.png';break;
	case ('Copper League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Copp_20_R.png';break;	
	case ('World League'):imscr_R_20='../images_rur/rurd/'+sblgimg+'_Ov_Worl_20_R.png';break;	
	default:	imscr_R_20='';				
	} 
	switch (data['O_IL'])
	{
  	case ('Diamond League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Diam_20_I.png';break;
	case ('Golden League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Gold_20_I.png';break;
	case ('Silver League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Silv_20_I.png';break;
	case ('Bronze League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Bron_20_I.png';break;
	case ('Copper League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Copp_20_I.png';break;	
	case ('World League'):imscr_I_20='../images_rur/rurd/'+sblgimg+'_Ov_Worl_20_I.png';break;	
	default:	imscr_I_20='';				
	} 
	switch (data['O_FL'])
	{
  	case ('Diamond League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Diam_20_F.png';break;
	case ('Golden League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Gold_20_F.png';break;
	case ('Silver League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Silv_20_F.png';break;
	case ('Bronze League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Bron_20_F.png';break;
	case ('Copper League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Copp_20_F.png';break;	
	case ('World League'):imscr_F_20='../images_rur/rurd/'+sblgimg+'_Ov_Worl_20_F.png';break;	
	default:	imscr_F_20='';				
	} 
	
	
	undt['logo']=data['logo']+'?'+$.now();
	undt['pic1']=data['pic1']+'?'+$.now();
	undt['pic2']=data['pic2']+'?'+$.now();

/*********block 1*/				
			$('.page-header').css('border-bottom','4px solid '+data['O_Color1']);
			$('.page-header:eq(2)').css('border-bottom','none');
			$('.page-header:eq(1)').css('border-bottom','none');
			var cdttoexp='<div class="cdttexp" style="display:none;color:'+data['O_Color1']+'"><input type="hidden" id="texp_wr" value="'+undt['O_WR']+'"/><input type="hidden" id="texp_wclr" value="'+data['O_Color1']+'"/><input type="hidden" id="texp_cr" value="'+data['O_CR']+'"/></div>';
			//alert(cdttoexp);
			//htkd=htkd+'<div class="univercity az-uni-profile color2" id="uncont" data-border-color="[sort]_Color1"><div class="uni-top"><div class="uni-top-osn"><div class="uni-logo"><img src=".'+data['logo']+'" alt="" data-src="Logo" /></div><div class="uni-league"><div class="uni-score"><img src=".'+data['O_80p']+'" alt="" style="width: 40px; height: 40px;"/></div><div class="uni-name"  style="color:'+data['O_Color1']+'">'+data['O_OL']+'</div></div><div class="uni-info"><div class="uni-info-title">';
			htkd=htkd+'<div class="univercity az-uni-profile color2" id="uncont" data-border-color="[sort]_Color1"><div class="row uni-top"><div class="uni-top-osn col-md-10 ptb10"><div class="uni-logo col-md-1 ptb1"><img src=".'+undt['logo']+'" alt="" data-src="Logo"></div><div class="uni-info col-md-8 ptb8"><div class="uni-info-title"><span style="color:'+data['O_Color1']+';width: 95%;display: block;">'+data['univ_name']+'</span></div><div class="uni-address-p"><p class="uni-economy" data-text="Economy">'+data['country']+'</p><p class="uni-address-pp" data-text="Address">'+data['addr']+'</p></div><div class="uni-flag"><img src=".'+data['flag']+'" alt="" data-src="Flag"></div></div><div class="uni-league col-md-1 ptb1"><div class="uni-score"><img src=".'+data['O_80p']+'" alt="" style="width: 40px; height: 40px;"></div><div class="uni-name" style="color:'+data['O_Color1']+'"><span style="text-align: center;display: table-cell;">'+data['O_OL']+'</span></div></div></div><div class="uni-rank-title col-md-2 ptb2"><div class="uni-world-rank color2 col-md-1 ptb1"><div class="uni-rank-text" style="color:'+data['O_Color1']+'"><span id="wrdrnk" style="color:'+data['O_Color1']+';text-align: center;display: table-cell;">World rank</span>'+undt['O_WR']+'</div></div><div class="uni-rank color2 col-md-1 ptb1"><div class="uni-rank-text" style="color:'+data['O_Color1']+';text-align: center;"><span style="color:'+data['O_Color1']+';text-align: center;display: table-cell;">Country rank</span>'+data['O_CR']+'</div></div></div></div>';
			
/*********block 2*/					

       // htkd=htkd+'<span style="color:'+data['O_Color1']+'">'+data['univ_name']+'</span>';

/*********block 3*/	

		htkd=htkd+'<div class="uni-osn"><div class="uni-mid"><div class="uni-osninfo" style="background:'+data['O_Color4']+';"><div class="YR" id="YR" data-text="Year" style="display:none;">&nbsp;</div><dl class="uni-info-list"><dd>Foundation year:</dd><dt data-text="Foundation">'+data['found']+'</dt><dd>Short name:</dd><dt data-text="Short name">'+data['sh_nm']+'</dt><dd>Type:</dd><dt data-text="Type">'+data['type']+'</dt><dd>Students:</dd><dt data-text="Students" id="studts">'+studnt+'</dt><dd>Faculty:</dd><dt data-text="Faculty">'+faclty+'</dt><dd>Students/Faculty Ratio:</dd><dt data-text="FS" style="width:auto;">'+data['fs']+'</dt><dt style="width:auto;">:</dt><dt data-text="Sc" style="width:auto;">'+data['Sc']+'</dt><dd>Website:</dd><a href="'+undt['website']+'" target="_blank"><div id="WS"><dt data-text="Website">'+data['website']+'</dt></div></a><dd>Region:</dd><dt data-text="Region">'+data['region']+'</dt><dd>Location:</dd><dt data-text="Location">'+data['loc']+'</dt>';
		//alert(ssbj);
		if(Number(sdt)>2017&&ssbj=='Overall')
		{
         /* if(data['avr_bak']!='-')
          {htkd=htkd+'<dd>Tuition Bachelor:</dd><dt data-text="Tuition Bachelor">'+data['avr_bak']+' $</dt><dd>Master`s studies:</dd><dt data-text="Master`s studies">'+data['avr_mag']+' $</dt>';}
          else{htkd=htkd+'<dd>Tuition Bachelor:</dd><dt data-text="Tuition Bachelor">'+data['avr_bak']+' </dt><dd>Master`s studies:</dd><dt data-text="Master`s studies">'+data['avr_mag']+' </dt>';}*/
        }
		htkd=htkd+'</dl></div><div class="uni-about"><table class="uni-about-table table-title"><tbody><tr><th>&nbsp;</th><th style="color:'+data['O_Color1']+'">Rankings</th><th style="color:'+data['O_Color1']+'">Rank</th><th style="color:'+data['O_Color1']+'">Score</th></tr></tbody></table><table class="uni-about-table table-main table-border" id="tblrank"><tbody><tr id="tblrnk_O_WR"><td><img src=".'+data['O_O_s']+'" alt="" style="width: 15px; height: 15px;" data-src="[sort]_O_s" /></td><td>World University Ranking</td><td data-text="O_WR">'+undt['O_WR']+'</td><td data-text="O_WS">'+data['O_WS']+'</td></tr><tr id="tblrnk_O_TR"><td><img src="'+imscr_T_20+'" alt="" style="width: 15px; height: 15px;" data-src="[sort]_T_s" /></td><td>Teaching Ranking</td><td data-text="O_TR">'+undt['O_TR']+'</td><td data-text="O_TS">'+data['O_TS']+'</td></tr><tr id="tblrnk_O_RR"><td><img src="'+imscr_R_20+'" alt="" style="width: 15px; height: 15px;" data-src="[sort]_R_s" /></td><td>Research Ranking</td><td data-text="O_RR">'+undt['O_RR']+'</td><td data-text="O_RS">'+data['O_RS']+'</td></tr><tr id="tblrnk_O_IR"><td><img src="'+imscr_I_20+'" alt="" style="width: 15px; height: 15px;" data-src="[sort]_I_s" /></td><td>International Diversity Ranking</td><td data-text="O_IR">'+undt['O_IR']+'</td><td data-text="O_IS">'+data['O_IS']+'</td></tr><tr id="tblrnk_O_FR"><td><img src="'+imscr_F_20+'" alt="" style="width: 15px; height: 15px;" data-src="[sort]_F_s" /></td><td>Financial Sustainability Ranking</td><td data-text="O_FR">'+undt['O_FR']+'</td><td data-text="O_FS">'+data['O_FS']+'</td></tr></tbody></table></div><div class="uni-additional"><table class="uni-additional-table table-title"><tbody><tr style="color:'+data['O_Color1']+'"><th data-text-color="[sort]_Color1">Additional Rankings</th><th data-text-color="[sort]_Color1">Rank</th><th data-text-color="[sort]_Color1">Score</th></tr></tbody></table><table class="uni-additional-table table-main"><tbody><tr><td>Reputation Rankings</td><td id="reprnk">'+ data['wrr']+'</td><td id="repscr">'+data['wsr']+'</td></tr><tr><td>Academic Rankings</td><td id="resrnk">'+data['wrp']+'</td><td id="resscr">'+data['wsp']+'</td></tr></tbody></table></div></div><div class="uni-bot"><div class="uni-title-line uni-title-line-max" data-text-color="[sort]_Color1" style="color:'+data['O_Color1']+'"><table><tbody><tr class="dimhd"><td class="td1" rowspan=2>Indicator<br>Group<br>Weight</td><td class="td2i" style="text-align: center;border-bottom: 1px solid '+data['O_Color3']+';" colspan="4">Indicator</td></tr><tr class="dimhd"><td class="td2" style="weight:85%;"><span style="float: left;margin-left:0px;">Name</span><span style="float: right;text-align: right;margin-right:-42px;">Weight</span></td><td class="td3" style="text-align: right;padding-left:35px;padding-right:0px;">&nbsp;&nbsp;Rank</td><td class="td4" style="text-align: center;padding-left:0px;">&nbsp;&nbsp;Score</td></tr></tbody></table></div><div class="uni-block block1 az-block-t"><div class="uni-block-left" data-bg-color="T_Color3" style="background:'+data['T_Color3']+';"><table><tbody><tr><td colspan="2" class="up">TEACHING RANKING</td></tr><tr><td>World Rank:</td><td data-text="O_TR">'+undt['O_TR']+'</td></tr><tr><td>Country rank:</td><td data-text="T_CR">'+data['T_CR']+'</td></tr><tr><td>Score:</td><td data-text="O_TS">'+data['O_TS']+'</td></tr><tr><td>League:</td><td data-text="O_TL">'+data['O_TL']+'</td></tr></tbody></table></div><div class="uni-title-line uni-title-line-min" data-text-color="[sort]_Color1"><table><tbody><tr><td class="td1">Rankings<br />weight</td><td class="td2">Indicator<br />name</td><td class="td3"></td></tr></tbody></table></div><div class="uni-block-right"><div class="pie-chart"><div id="PIE_chart1">';
	switch (data['O_TL'])
	{
  	case ('Diamond League'):htkd=htkd+'<img src="../images/T_D.jpg" alt="" />';break;
	case ('Golden League'):htkd=htkd+'<img src="../images/T_G.jpg" alt="" />';break;
	case ('Silver League'):htkd=htkd+'<img src="../images/T_S.jpg" alt="" />';break;
	case ('Bronze League'):htkd=htkd+'<img src="../images/T_B.jpg" alt="" />';break;
	case ('Copper League'):htkd=htkd+'<img src="../images/T_C.jpg" alt="" />';break;	
	case ('World League'):htkd=htkd+'<img src="../images/T_W.jpg" alt="" />';break;	
	default:	htkd=htkd+'<img src="../images/T_D.jpg" alt="'+data['univ_name']+'"/>';				
	}
/*********block 4*/	
			htkd=htkd+'</div><span class="az-dim-weight">40</span>%</div><table><tbody><tr><td class="td2"><span class="indlftnm">Academic staff per students</span><span class="rhtprc">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR1']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I1']+'</span></td></tr><tr><td><span class="indlftnm">Academic staff per bachelor degrees awarded</span><span class="rhtprc">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR2']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I2']+'</span></td></tr><tr><td><span class="indlftnm">Doctoral degrees awarded per academic staff</span><span class="rhtprc">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR3']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I3']+'</span></td></tr><tr><td><span class="indlftnm">Doctoral degrees awarded per bachelor degrees awarded</span><span class="rhtprc">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR4']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I4']+'</span></td></tr><tr><td><span class="indlftnm">World teaching reputation</span><span class="rhtprc">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR5']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I5']+'</span></td></tr></tbody></table></div></div><div class="uni-block block2 az-block-r"><div class="uni-block-left" data-bg-color="T_Color3" style="background:'+data['R_Color3']+';"><table><tbody><tr><td colspan="2" class="up">RESEARCH RANKING</td></tr><tr><td>World Rank:</td><td data-text="O_RR">'+undt['O_RR']+'</td></tr><tr><td>Country rank:</td><td data-text="R_CR">'+data['R_CR']+'</td></tr><tr><td>Score:</td><td data-text="O_RS">'+data['O_RS']+'</td></tr><tr><td>League:</td><td data-text="O_RL">'+data['O_RL']+'</td></tr></tbody></table></div>';
			
/*********block 5*/	
			
			htkd=htkd+'<div class="uni-title-line uni-title-line-min" data-text-color="[sort]_Color1"><table><tbody><tr><td class="td1">Indicator<br /> Group<br />weight</td><td class="td2">Indicator<br />name</td><td class="td3">Indicator<br />weight</td></tr></tbody></table></div><div class="uni-block-right"><div class="pie-chart"><div id="PIE_chart2">';
	switch (data['O_RL'])
	{
  	case ('Diamond League'):htkd=htkd+'<img src="../images/R_D.jpg" alt="" />';break;
	case ('Golden League'):htkd=htkd+'<img src="../images/R_G.jpg" alt="" />';break;
	case ('Silver League'):htkd=htkd+'<img src="../images/R_S.jpg" alt="" />';break;
	case ('Bronze League'):htkd=htkd+'<img src="../images/R_B.jpg" alt="" />';break;
	case ('Copper League'):htkd=htkd+'<img src="../images/R_C.jpg" alt="" />';break;	
	case ('World League'):htkd=htkd+'<img src="../images/R_W.jpg" alt="" />';break;	
	default:	htkd=htkd+'<img src="../images/R_D.jpg" alt="" />';				
	}
	
/*********block 6*/	
	
	htkd=htkd+'</div><span class="az-dim-weight">40</span>%</div><table><tbody><tr><td class="td2"><span class="indlftnm">Citations per academic and research staff</span><span class="rhtprc" style="margin-right: 0px;">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR6']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I6']+'</span></td></tr><tr><td  id="ddrap"><span class="indlftnm">Doctoral degrees awarded per admitted PhD</span><span class="rhtprc" style="margin-right:0px;">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR7']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I7']+'</span></td></tr><tr><td><span class="indlftnm">Normalized citation impact</span><span class="rhtprc" style="margin-right: 0px;">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR8']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I8']+'</span></td></tr><tr><td><span class="indlftnm">Papers per academic and research staff</span><span class="rhtprc" style="margin-right: 0px;">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR9']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I9']+'</span></td></tr><tr><td><span class="indlftnm">World research reputation</span><span class="rhtprc" style="margin-right: 0px;">8%</span></td><td class="td3"><span class="az-indicator">'+data['IR10']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I10']+'</span></td></tr></tbody></table></div></div>';

/*********block 7*/	
	
			htkd=htkd+'<div class="uni-block block3 az-block-i"><div class="uni-block-left" data-bg-color="T_Color3" style="background:'+data['I_Color3']+';"><table><tbody><tr><td colspan="2" class="up"><b>INTERNATIONAL DIVERSITY RANKING</b></td></tr><tr><td>World Rank:</td><td data-text="O_IR">'+undt['O_IR']+'</td></tr><tr><td>Country rank:</td><td data-text="I_CR">'+data['I_CR']+'</td></tr><tr><td>Score:</td><td data-text="O_IS">'+data['O_IS']+'</td></tr><tr><td>League:</td><td data-text="O_IL">'+data['O_IL']+'</td></tr></tbody></table></div><div class="uni-title-line uni-title-line-min" data-text-color="[sort]_Color1"><table><tbody><tr><td class="td1">Rankings<br />weight</td><td class="td2">Indicator<br />name</td><td class="td3">Indicator<br />weight</td></tr></tbody></table></div><div class="uni-block-right"><div class="pie-chart"><div id="PIE_chart3">';
					switch (data['O_IL'])
	{
  	case ('Diamond League'):htkd=htkd+'<img src="../images/I_D.jpg" alt="" />';break;
	case ('Golden League'):htkd=htkd+'<img src="../images/I_G.jpg" alt="" />';break;
	case ('Silver League'):htkd=htkd+'<img src="../images/I_S.jpg" alt="" />';break;
	case ('Bronze League'):htkd=htkd+'<img src="../images/I_B.jpg" alt="" />';break;
	case ('Copper League'):htkd=htkd+'<img src="../images/I_C.jpg" alt="" />';break;	
	case ('World League'):htkd=htkd+'<img src="../images/I_W.jpg" alt="" />';break;	
	default:	htkd=htkd+'<img src="../images/I_D.jpg" alt="" />';				
	}

/*********block 8*/	
	
			htkd=htkd+'</div><span class="az-dim-weight">10</span>%</div><table><tbody><tr><td class="td2"><span class="indlftnm">Share of international academic staff</span><span class="rhtprc">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR11']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I11']+'</span></td></tr><tr><td><span class="indlftnm">Share of international students</span><span class="rhtprc">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR12']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I12']+'</span></td></tr><tr><td><span class="indlftnm">Share of international co-authored papers</span><span class="rhtprc">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR13']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I13']+'</span></td></tr><tr><td id="itr"><span class="indlftnm">Reputation outside region</span><span class="rhtprc">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR14']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I14']+'</span></td></tr><tr><td id="ib"><span class="indlftnm">International level</span><span class="rhtprc">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR15']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I15']+'</span></td></tr></tbody></table></div></div><div class="uni-block block4 az-block-f"><div class="uni-block-left" data-bg-color="T_Color3" style="background:'+data['F_Color3']+';"><table><tbody><tr><td colspan="2" class="up">FINANCIAL SUSTAINABILITY RANKING</td></tr><tr><td>World Rank:</td><td data-text="O_FR">'+undt['O_FR']+'</td></tr><tr><td>Country rank:</td><td data-text="F_CR">'+data['F_CR']+'</td></tr><tr><td>Score:</td><td data-text="O_FS">'+data['O_FS']+'</td></tr><tr><td>League:</td><td data-text="O_FL">'+data['O_FL']+'</td></tr></tbody></table></div><div class="uni-title-line uni-title-line-min" data-text-color="[sort]_Color1"><table><tbody><tr><td class="td1">Rankings<br />weight</td><td class="td2">Indicator<br />name</td><td class="td3">Indicator<br />weight</td></tr></tbody></table></div><div class="uni-block-right"><div class="pie-chart"><div id="PIE_chart4">';	
	switch (data['O_FL'])
	{
  	case ('Diamond League'):htkd=htkd+'<img src="../images/F_D.jpg" alt="" />';break;
	case ('Golden League'):htkd=htkd+'<img src="../images/F_G.jpg" alt="" />';break;
	case ('Silver League'):htkd=htkd+'<img src="../images/F_S.jpg" alt="" />';break;
	case ('Bronze League'):htkd=htkd+'<img src="../images/F_B.jpg" alt="" />';break;
	case ('Copper League'):htkd=htkd+'<img src="../images/F_C.jpg" alt="" />';break;	
	case ('World League'):htkd=htkd+'<img src="../images/F_W.jpg" alt="" />';break;	
	default:	htkd=htkd+'<img src="../images/F_D.jpg" alt="" />';				
	}
	
/*********block 9*/	

			htkd=htkd+'</div><span class="az-dim-weight">10</span>%</div><table><tbody><tr><td class="td2"><span class="indlftnm" id="f16">Institutional income per academic staff</span><span class="rhtprc" style="text-align:center;padding-left: 12px;">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR16']+'</span></td><td class="td4"><span class="az-indicator" style="text-align:center;">'+data['O_I16']+'</span></td></tr><tr><td><span class="indlftnm" id="f17">Institutional income per students</span><span class="rhtprc" style="text-align:center;padding-left: 12px;">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR17']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I17']+'</span></td></tr><tr><td><span class="indlftnm" id="f18">Papers per research income</span><span class="rhtprc" style="text-align:center;padding-left: 12px;">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR18']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I18']+'</span></td></tr><tr><td><span class="indlftnm">Research income per academic and research staff</span><span class="rhtprc" style="text-align:center;padding-left: 12px;">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR19']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I19']+'</span></td></tr><tr><td><span class="indlftnm" id="f20">Research income per institutional income</span><span class="rhtprc" style="text-align:center;padding-left: 12px;">2%</span></td><td class="td3"><span class="az-indicator">'+data['IR20']+'</span></td><td class="td4"><span class="az-indicator">'+data['O_I20']+'</span></td></tr></tbody></table></div></div></div></div>';
			
/*********block 10*/				
			
			htkd=htkd+'<div class="pagebreak"></div><div class="uni-dop"><div class="uni-subinfo uni-subinfo-overview az-uni-profile"><div class="uni-subinfo-img-box"><img src=".'+undt['pic1']+'" alt="" data-src="Picture1" /></div><div class="uni-subinfo-text-box"><h2 class="uni-subinfo-h" data-text-color="[sort]_Color1" style="color: '+data['O_Color1']+';">Overview</h2><div data-text="Overview" class="overview scroll-pane">'+data['over']+'</div></div></div><div class="uni-subinfo az-uni-profile"><div class="uni-subinfo-img-box"><img src=".'+undt['pic2']+'" alt="" data-src="Picture2" /></div><div class="uni-subinfo-text-box" id="txtmiss"><h2 class="uni-subinfo-h" data-text-color="[sort]_Color1" style="color: '+data['O_Color1']+';">Mission Statement</h2><div data-text="Mission" class="mission scroll-pane">'+data['miss']+'</div></div></div><div class="mapbl"><div id="map" style="display: block;></div></div></div><div style="clear:both;"></div>';
								
			$('.d3').css('display','block');
			$('.d3').html(cdttoexp+htkd);
		    if(Number(data['year'])<2016)
	        {
				$('#itr').html('<span class="indlftnm">International teaching reputation</span><span class="rhtprc">2%</span>');
				$('#ib').html('<span class="indlftnm">Share of international bachelor degrees awarded</span><span class="rhtprc">2%</span>');
				$('#ddrap').html('<span class="indlftnm">Doctoral degrees awarded per admitted PhD</span><span class="rhtprc" style="margin-right: 0px;">8%</span>');	
			}
			else
			{
					$('#itr').html('<span class="indlftnm">Reputation outside region</span><span class="rhtprc">2%</span>');
					$('#ib').html('<span class="indlftnm">International level</span><span class="rhtprc">2%</span>');
					if(data['subj']!='Overall')
					{
						$('#ddrap').html('<span class="indlftnm">Share of graduate degrees awarded</span><span class="rhtprc" style="left:4px;">8%</span>');	
					}
					else
					{
					$('#ddrap').html('<span class="indlftnm">Doctoral degrees awarded per admitted PhD</span><span class="rhtprc" style="margin-right: 0px;">8%</span>');	
					}
			}
			if(Number(data['year'])>=2020&&($('#subj').val()=='SH'||$('#subj').val()=='SL'||$('#subj').val()=='SM'||$('#subj').val()=='SS'))
            {
			
              	$('#f16').html('Research income per citations');
              	$('#f17').html('Research income per students');
              	$('#f18').html('Research income per papers');
              	$('#f20').html('Level of Financial Sustainability');
            }
          	else
            {
            	if(Number(data['year'])>2020&&$('#subj').val()!='SO')
             	{
			 		$('#f16').html('Research income per citations');
              		$('#f17').html('Research income per students');
              		$('#f18').html('Research income per papers');
              		$('#f20').html('Level of Financial Sustainability');
			 	}
            	else	
            	{	
            		$('#f16').html('Institutional income per academic staff');
              		$('#f17').html('Institutional income per students');
              		$('#f18').html('Papers per research income');
              		$('#f20').html('Research income per institutional income');
            	}
			}	
			if(data['cord'])
			{
				var latvl=$.trim(data['cord'].split(',')[0]);var lngvl=$.trim(data['cord'].split(',')[1]);
				var uluru =[latvl,lngvl];
				var unnm=data['univ_name'];
				var addr=data['addr'];
			}
			else
			{
				var uluru = [55.709622, 37.619492];
				var ttlvl='RUR team';
			}
			//55.709622, 37.619492
			switch (data['O_OL'])
			{
		  	case ('Diamond League'):var image ='../images_rur/Konf/kn_diamond.png';break;
			case ('Golden League'):var image ='../images_rur/Konf/kn_gold.png';break;
			case ('Silver League'):var image ='../images_rur/Konf/kn_silver.png';break;
			case ('Bronze League'):var image ='../images_rur/Konf/kn_bronze.png';break;
			case ('Copper League'):var image ='../images_rur/Konf/kn_cooper.png';break;	
			case ('World League'):var image ='../images_rur/Konf/kn_world.png';break;	
			default:	var image ='../images/marker_world_50.png';				
			}
			if(Number($(window).width())>1000)
          	{
          		
          		//alert(Number($(window).width()));
          		var ht_flag=$('.uni-info-title span').css('height');
			 	ht_flag=ht_flag.substring(0,ht_flag.length-2);
				if(Number(ht_flag)>70)
				{$('.uni-flag img').css('bottom','6.5em');}
				else
				{
					if(Number(ht_flag)>50)
					{$('.uni-flag img').css('bottom','4.4em');}
					else{$('.uni-flag img').css('bottom','3em');}
				}
			}
			else
			{$('.uni-flag img').css('bottom','0em');}
			setTimeout(function(){
				$('.gmap3').css('display','none');
				$('#map').css('display','block');
				//ymaps.ready(init);
				//init();
				initMap();
				},300);
		
				
			//	viewmap();
			function viewmap() 
			{
			    $('#test')
			      .gmap3({
			        zoom: 4,
			        center: uluru
			      })
			      .marker({
			        position: uluru,
			        icon: image,//{width:15, height:18},
			        title:ttlvl
			      })
			      .infowindow({
			        content: contentString
			      })
			     /* .icon({width:15, height:18})*/
			      .then(function (infowindow) {
			        var map = this.get(0);
			        var marker = this.get(1);
			        marker.addListener('click', function() {
			          infowindow.open(map, marker);
			        });
			        
			      })
			    ;
		  	}
            
    function getLastFeatures () {
        return window.mappanel.map.getLayers().getArray()[window.mappanel.map.getLayers().getArray().length - 1].getSource().getFeatures();
    }
    
    function addMarkers (mrks, needClickOnFirst) {
        if (!mrks || !mrks.length || mrks.length < 1) {
            console.log('ERR: mrks is not defined');
            return;
        }
        if (!needClickOnFirst) {
            window.needClickOnFirst = false;
            mappanel.map.getLayers().getArray().map((e, i) => {if (i>0) mappanel.map.getLayers().getArray().splice(1) }); // rest only first layer
        } else {
            window.needClickOnFirst = true;
        }
        //console.log('markers: ', mrks); ///
        //console.log(mrks[0]);    
        
        try {
            document.getElementById('popup').outerHTML = '';
        } catch (e456343456) {
        }
        
        container = document.createElement('div');
        container.setAttribute('id', 'popup');
        container.title = '';
        container.innerHTML = `<a href="#" id="popup-closer" class="ol-popup-closer"></a><div id="popup-content" style="background-color: white;"></div>`;
        container.class='ol-popup';
        document.body.appendChild(container);
        
        // Popup showing the position the user clicked
        var container = document.getElementById('popup');
        var popup = new ol.Overlay({
            element: container,
            offset: [15, 20],
            positioning: 'top-left', 
            //autoPan: true,
            //autoPanAnimation: {
            //    duration: 250
            //}
        });
        window.mappanel.map.addOverlay(popup);
        
        console.log(mrks.length);
        
        var features = [];
        mrks.forEach(function (m, i) {
            //console.log(dt[i+1]);
            
            var iconFeature = new ol.Feature({
                ///geometry: new ol.geom.Point(ol.proj.transform([106.8478695, -6.1568562], 'EPSG:4326', 'EPSG:3857'))
                geometry: new ol.geom.Point(ol.proj.fromLonLat([m[0].lng, m[0].lat])), /// [106.8478695, -6.1568562]))),
                n: i+1,
                type: 'Point',
                info: (!!m[3] ? m[3] : '<div><h3>Missing info</h3></div>'),
                desc: '' // + '<pre>'
                        + '<b>' + (!!m[1] ? m[1] : 'Unnamed') + '</b>' + '<br/>'
                        + ' ' + '[Lat, Lng: ' + m[0].lat + ', ' + m[0].lng + ']', //+ ' </pre>', 
            });
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({ // IconOptions
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: (!!m[2] ? m[2] : 'images_rur/Konf/diamondw.png'), // dt[i+1].iconurl
                })),
                text: new ol.style.Text({
                    scale: 1.2,
                }),
            });
            iconFeature.setStyle(iconStyle);
            features.push(iconFeature);
        });
        
        var vectorSource = new ol.source.Vector({
            features: features,      //add an array of features
            //,style: iconStyle     //to set the style for all your features...
        });
        var markersOL = new ol.layer.Vector({
            source: vectorSource
        });
        ///markersOL.getSource().addFeature(marker);
        window.mappanel.map.addLayer(markersOL);
        features = [];
        
        wasClickedTrigger = 0;
        

        function closeTooltip (panel) {
            if (Ext.getVersion().major > 5) {
                Ext.getCmp(panel.el.down('.x-tool-close').up().id).setTooltip('\0')
            } else {
                Ext.create('Ext.tip.ToolTip', {
                    target: panel.el.down('.x-tool-close').id,
                    html: '\0'
                });
            }
        }
        
        /* Add a pointermove handler to the map to render the popup.*/
        window.mappanel.map.on('pointermove', function (evt) {
            var feature = window.mappanel.map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                return feat;
            });

            this.getTargetElement = (!this.getTargetElement) ? this.getTarget : this.getTargetElement;
            if (feature && feature.get('type') == 'Point') {
                this.getTargetElement().style.cursor = 'pointer';
            } else {
                this.getTargetElement().style.cursor = '';
            }

            if (feature && feature.get('type') == 'Point' && (!wasClickedTrigger || (feature.get('n') != lastMissed && (lastMissed = feature.get('n')) != wasClickedTrigger && (++missedCount) >= 2))) {
                var coordinate = evt.coordinate;    //default projection is EPSG:3857 you may want to use ol.proj.transform
                content = document.getElementById('popup-content'); ///
                content.innerHTML = feature.get('desc');
                popup.title = feature.get('name');
                wasClickedTrigger = 0;
                missedCount = 0;
                lastMissed = 0;
                popup.setPosition(coordinate);
            } else {
                if (!wasClickedTrigger) {
                    popup.setPosition(undefined);
                }
            }
        });
        
        window.mappanel.map.on('click', function (evt) {
            popup.setPosition(undefined);
            var feature = window.mappanel.map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                return feat;
            });
            
            if (!!evt.coordinate && window.needClickOnFirst && getLastFeatures()[0].getGeometry().getCoordinates()[0] == evt.coordinate[0] && getLastFeatures()[0].getGeometry().getCoordinates()[1] == evt.coordinate[1]) {
                feature = getLastFeatures()[0];
            }
            
            if (feature && feature.get('type') == 'Point' && (feature.get('n') != wasClickedTrigger || window.needClickOnFirst)) {
                var coordinate = evt.coordinate;
                var windowCoord = JSON.stringify(coordinate);
                
                if (ti) {
                    clearTimeout(ti);
                    ti = null;
                }
                ti = setTimeout(function () {
                    wasClickedTrigger = 0;
                    window.lastWindowCoord = '[0,0]'; // TODO: reset coords within on close dialog window
                }, 500); // We assume that user must not search same object or same action faster then 0.5 s.
                popup.setPosition(coordinate);
                
                if (windowCoord == window.lastWindowCoord) {
                    return;
                } else {
                    window.lastWindowCoord = windowCoord;
                    console.log(window.lastWindowCoord); //
                }
                
                window.needClickOnFirst = false;
                
                content = document.getElementById('popup-content'); ///
                content.innerHTML = feature.get('info');
                popup.title = feature.get('name');
                wasClickedTrigger = feature.get('n');
                missedCount = 1;
                lastMissed = wasClickedTrigger;
                
                setTimeout(function () {
                    Ext.create('Ext.window.Window', {
                        layout: 'fit',
                        html: $('#popup').html(),
                        renderTo: 'map', /// 'perfectmap_div', /// Ext.getBody(),
//                        listeners: {
//                            afterrender: closeTooltip
//                        },
                        buttons: [],
                        tools: [{
                            type:'refresh',
                            tooltip: null,
                            handler: function (event, toolEl, panel) {
                            }
                        },
                        ]
                    }).show();
                    popup.setPosition(undefined);
                }, 10);
            } else {
                if (!wasClickedTrigger) {
                    wasClickedTrigger = 0;
                    popup.setPosition(undefined);
                }
            }
        
        });

        if (needClickOnFirst) {
            let feature = getLastFeatures()[0];
            let evt = {};
            evt.type = 'click';
            ///alert(feature.get('type')); // Point
            ///evt.coordinate = [];  evt.coordinate[0] = 6633511;  evt.coordinate[1] = 4079902;
            evt.coordinate = feature.getGeometry().getCoordinates();
            evt.pixel = window.mappanel.map.getPixelFromCoordinate(evt.coordinate);
            
            window.mappanel.map.dispatchEvent(evt); // vector layer
        }

    }
    
    function getWorldRating (dt, title, i) {
        if (!dt) {
            return undefined;
        }
        if (!title && (!i || i == 0 || i < 0)) {
            return null;
        }
        if (!title || title === true || Array.isArray(title) || !title.length || title.trim().length == 0) {
            title = null;
        } else if (!i || i == 0 || i < 0) {
            i = 0; // dt starts from index 1
        }
        
        if (i > 0 && !title) {
            title = dt[i]['univ_name'];
        } else {
            i = -1;
            for (let j=1; !!dt[j]; ++j) {
                if (dt[j]['univ_name'] == title) {
                    i = j;
                    break;
                }
            }
        }
        if (i <= 0 || dt[i]['univ_name'] != title) {
            console.warn('You should use only one of arguments: title, i');
            return null;
        }
        return dt[i]['O_WR'];
    }
            
		  	function initMap() {
                if (!window.google) { window.google = {} }; if (!google.maps) { google.maps = {} }; if (!google.maps.InfoWindow) { google.maps.InfoWindow = function () {} }; if (!google.maps.Map) { google.maps.Map = function () {} };  if (!google.maps.Marker) { google.maps.Marker = function () {} };  if (!google.maps.MapTypeId) { google.maps.MapTypeId = {} };
                               
                if ($('#map').length == 0) {
                    $('.mapbl').html('<div id="map" style="display: block;"></div>');
                }
                if (!window.mappanel || !window.mappanel.map) {
                    window.mappanel = {}; // TODO recheck
                    window.mappanel.map = $('#map')[0];
                }
                console.log('map short: ', window.mappanel.map);
                               
			    var lt=Number(latvl);
				var lg=Number(lngvl);
				zummap=Number(12);
				var unic=image;
				///var uninfo = '<div style="background-color: '+data['O_Color3']+'"><a href="https://www.google.com/maps/@'+lt+','+lg+',15z" target="_blank" style="font-size: 1.2em;">View<br><b>'+data['univ_name']+'</b><br>in Goole Map</a></div>';
                var unnm='#'+data['O_WR']+' '+data['univ_name'];
                var uninfo = '<div style="background-color: '+data['O_Color3']+'"><a href=\'/world-map_ggl23.html#' + ('{"lat": '+lt+',"lng": '+lg+',"z": 15}' + (encodeURIComponent(','+unnm+',./images_rur/Konf/worldw.png,'+data['O_Color3']).replaceAll('%2C', ','))) + '\' target="_blank" style="font-size: 1.2em;">View<br><b>'+data['univ_name']+'</b><br>in OpenLayers + OSM Map</a></div>';
				var icnsrc='';
				var url = './images_rur/Konf/';
				$('.gm-style-iw-d').css('background-color','antiquewhite');
				$('.mapbl').empty().append(!!window.mappanel.map.getTargetElement ? (window.mappanel.map.getTargetElement() ? window.mappanel.map.getTargetElement() : $('#map')[0]) : window.mappanel.map); /// $('.mapbl').empty().append('<div id="map" style="display: block;"></div>'); /// instead inner .html(text)
				const uluru = { lat: lt, lng: lg };
                               
                
                if (window.ol && ol.View && !window.mappanel.map.setView) {
                    let city = ol.proj.fromLonLat([-3.696100, 40.410800]); // Madrid, Spain
                    window.mappanel.map = new ol.Map({
                        target: 'map', // div#map
                        renderer: 'canvas',
                        layers: [new ol.layer.Tile({
                          source: new ol.source.OSM({
                            url: 'https://{a-c}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=1d9dac89153143559cbd69253649c9d7', ///url: 'https://osmap.{s}.tile.mapcdn.net/en/map/v1/{z}/{x}/{y}.png', ///url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                          }),
                        })],
                        controls: ol.control.defaults().extend([
                            new ol.control.FullScreen({
                                source: 'map', ///'perfectmap_div', ///
                            }), /// Ext.getCmp('MapPanel').updateLayout()
                        ]),
                        view: new ol.View({
                            center: city,
                            zoom: 2,
                        }),
                        moveTolerance: 20,
                    });
                }

                
                const coord = uluru;
                if (window.mappanel && window.mappanel.map && window.mappanel.map.setView && window.ol && ol.View) {
                    let pos = [coord.lat, coord.lng]; /// JSON.parse('['+record.data['cord']+']');
                    pos = [pos[1], pos[0]];
                    let city = ol.proj.fromLonLat(pos);
                    
                    window.mappanel.map.setView(new ol.View({
                        center: city,
                        zoom: 12, ///zummap ?? 12,
                    }));
                    
                    let title = unnm;
                    var mrks = [{
                        0: coord, // position coord
                        1: title, // `#${getWorldRating(dt, title, null)} - ${title}`,
                        2: (!!icnsrc && icnsrc.length > 0) ? icnsrc : unic, // icon
                        3: uninfo, // info content
                    }]; // only one marker
                    addMarkers(mrks, false);
                    
                    return; /// !!!   
                }
                
                
                
				const map = new google.maps.Map(document.getElementById("map"), {
				    zoom: zummap,
				    center: uluru,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				  });
				 // The marker, positioned at Uluru
				  const marker = new google.maps.Marker({
				    position: uluru,
				    title:unnm,
				    icon:unic,
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
			function init_1 ()
			{
	
    		var myMap = new ymaps.Map('map', 
    		{
            center:uluru,
            zoom: 10,
            controls: ['fullscreenControl']
        	}),
			myPlacemark1 = new ymaps.Placemark(uluru, {
             //balloonContentBody: cntnt1,
             hintContent: unnm,
             balloonContentFooter: '<a href="https://yandex.ru/maps?lang=en_EN&ll='+uluru[1]+','+uluru[0]+'&mode=search&text='+addr+'&z=16" target="_blank">View in Yandex Map</a>'
        	},
        	{
	            iconLayout: 'default#image',
	            iconImageHref: image,
	            iconImageSize: [15, 20],
	            //iconImageOffset: [0, 0],
	           balloonMinWidth: 200,
	           balloonMinHeight: 30,
	           balloonAutoPan:false,
	           balloonAutoPanCheckZoomRange:false
        	});
        	myMap.geoObjects.add(myPlacemark1);
	        //var go='myMap.geoObjects.add(myPlacemark1)';
			//eval(go);
   
		}
          	function init () {
    var myMap = new ymaps.Map("map", {
            center: uluru,
            zoom: 10,
            controls: ['fullscreenControl']
        }), 
        HintLayout = ymaps.templateLayoutFactory.createClass( "<div class='my-hint' style='display: inline-block;padding: 5px;height: auto;position: relative;left: -8em;width: 150px;font-size: 11px;line-height: 17px;color: #333333;text-align: center;vertical-align: middle;background-color:"+ data['O_Color3']+";border: 1px solid "+ data['O_Color1']+";border-radius: 20px;'>" + "<a href='https://yandex.ru/maps?lang=en_RU&ll="+uluru[1]+","+uluru[0]+"&mode=search&text="+addr+"&z=16' target='_blank'>"+"View in Yandex Map<br><b>{{ properties.object }}</b></a></div>"
        );
    var myPlacemark = new ymaps.Placemark(uluru, {object: unnm},
     {
        hintLayout: HintLayout,
	    iconLayout: 'default#image',
	    iconImageHref: image,
	    iconImageSize: [15, 20]
    });
    myMap.geoObjects.add(myPlacemark);
}
                viewdimens();
			}
		);

		}
		
	
		setTimeout(function()
		{
			
			 viewsubjects();
			 }, 400);
		setTimeout(function()
		{
			
			printdata();
		}, 1000);
	}
	});
	/*function viewpoint()
	{
			if(window.screen.width>680)
			{$('.point').css('width',Number($('#wrapper').css('width').slice(0,-2))/15.55+'px');}
			else{$('.line-block .point').css('margin','0 0 0 52px');}
			if(window.screen.width<990)
			{$('.uni-dop').css('margin-top','100px');}
		}*/
	function getunlnk(univ)
	{
		var univamp=univ.replace('&','!');
        var urlunlnk='../final/univ-array_link17.php?univ='+ encodeURI(univamp);
        //alert(urlunlnk);
		$.ajax(
		{
	  		url: urlunlnk,
	  		success: function(data)
	  	 	{
	  	 		$('#pglnk').html(data);
	  	 		$('#pglnk').css('display','none');//pglnk
              //alert($('#pglnk').html());
              make_loc();
	  	 	}	
	 	});
	 	//return unmlnk;
	}
	function getunnm()
	{ 	
		$('#prntr').attr('disabled','disabled');
		$('#university-name').typeahead('destroy');
		var yrunlst=$('#years option:selected').text();
		if(Number($('#years option:selected').text())>2013)
		{
			var  subunlst=$('.az-subject-sort :selected').text();
			if(subunlst=='All Subjects'){subunlst='Overall';}
		}
		else
		{
			var  subunlst='Overall';
			$('.az-subject-sort [value="SO"]').attr('selected','selected');
		}
		var urlun='/final/univ-array_rank17.php?year='+yrunlst+'&subj='+encodeURI(subunlst);
		
		var evvl='';
		$('#hdyr').val(urlun);
		$("#selun").html('');
		$.ajax(
		{
	  		url: urlun,
	  		success: function(data)
	  	 	{
				evvl='$("#university-name").typeahead({autoSelect:false,source: [';
 				var evvl_mdl=''; 
				$.each(data, function(key, val)
					{
						evvl_mdl=evvl_mdl+'{ID:'+key+', Name: "'+val+'"},';
					$('#selun').append('<option name="un'+key + '" value="'+key+'">'+val+'</option>');
					});
				evvl_mdl=evvl_mdl.slice(0,-1);
				evvl=evvl+evvl_mdl+' ],displayField: "Name",valueField: "ID",limit:"20"})';
				function displayResult(item)
				{
					$('.alert').show().html('You selected <strong>' + item.value + '</strong>: <strong>' + item.text + '</strong>');
				}
			//	alert(evvl);
				eval(evvl);
	  	 	}	
			
	 	});	
		return false;
	}
	function getunivnm()
	{ 	
		var urlun='/final/univ-array_17.php';
		$('body').append('<select name="" id="listunnm" style="display: none;"></select>');
		$.ajax(
		{
	  		url: urlun,
	  		success: function(data)
	  	 	{
				$.each(data, function(key, val)
				{
					$('#listunnm').append('<option value="'+key+'">'+val+'</option>');
				});
				//alert($('#listunnm option:last').text());
	  		}	
 		});	
		return false;
	}
	function viewdimens()
	{
		var dmcntr=$('#cntr :selected').val();
		var dv=$('#dimrank :selected').val();
	  	$('#tblrnk_O_WR').css('display','');
		$('#tblrnk_O_TR').css('display','');
		$('#tblrnk_O_RR').css('display','');
		$('#tblrnk_O_IR').css('display','');
		$('#tblrnk_O_FR').css('display','');
		$('.uni-subinfo-img-box').css('display','');
		$('#txtmiss').css('display','block');
		$('#tblrnk').css('font-size','12px');	
		$('#map').css('display','block');
		if($('#dimrank :selected').val()!='O')
		{
				$('.az-dim-weight').html('100');
			switch (dv)
			{
				case 'T':
					$('#tblrnk_O_WR').css('display','none');$('#tblrnk_O_RR').css('display','none');
					$('#tblrnk_O_IR').css('display','none');$('#tblrnk_O_FR').css('display','none');
					$('.uni-subinfo-img-box:gt(0)').css('display','none');
					$('#txtmiss').css('display','none');
					$('#tblrnk_O_TR').css('font-size','14px');
					$('.az-block-r').css('display','none');$('.az-block-i').css('display','none');$('.az-block-f').css('display','none');
					$('.dimhd').css('color',undt['T_Color1']);
					$('.td2i').css('border-bottom','1px solid'+undt['T_Color3']);
					$('.rhtprc').text('20%');
					$('.uni-score img').attr('src','.'+undt['T_80p']);
					$('.uni-name').css('color',undt['T_Color1']);$('.uni-name').text(undt['O_TL']);
					$('.uni-rank-text,.uni-rank-title span,.uni-info-title span').css('color',undt['T_Color1']);
					if(Number(dmcntr)>0)
					{
						$('.uni-rank-title').html('<div class="uni-world-rank color2" style="display:none;"><div class="uni-rank-text" ><span id="wrdrnk">World rank</span></div></div><div class="uni-rank color2" style="width: 100%;"><div class="uni-rank-text" style="color: '+undt['T_Color1']+'; text-align: center;"><span style="color: '+undt['T_Color1']+'; text-align: center;">Country rank</span>'+undt['O_TR']+'</div></div>');
					}
					else
					{
						$('.uni-rank-title').html('<div class="uni-world-rank color2"><div class="uni-rank-text" style="color:'+undt['T_Color1']+';"><span id="wrdrnk" style="color: '+undt['T_Color1']+';">World rank</span>'+undt['O_TR']+'</div></div><div class="uni-rank color2"><div class="uni-rank-text" style="color: '+undt['T_Color1']+'; text-align: center;"><span style="color: '+undt['T_Color1']+'; text-align: center;">Country rank</span>'+undt['T_CR']+'</div></div>');
					}
					$('.uni-subinfo-overview h2').css('color',undt['T_Color1']);
					$('.page-header').css('border-bottom','4px solid'+ undt['T_Color1']);
					$('table th').css('color',undt['T_Color1']);
					$('.uni-osninfo').css('background',undt['T_Color4']);
					$('#tblrnk_O_TR img').attr('src','.'+undt['T_Ts']);
					$('#dimhd td').css('color',undt['T_Color1']);
					$('.page-header:lt(1)').css('border-bottom','none');
					break;
				case 'R':
					$('#tblrnk_O_WR').css('display','none');$('#tblrnk_O_TR').css('display','none');
					$('#tblrnk_O_IR').css('display','none');$('#tblrnk_O_FR').css('display','none');
					$('.uni-subinfo-img-box:gt(0)').css('display','none');
					$('#txtmiss').css('display','none');
					$('#tblrnk_O_RR').css('font-size','14px');
					$('.az-block-t').css('display','none');$('.az-block-i').css('display','none');$('.az-block-f').css('display','none');
					$('.dimhd').css('color',undt['R_Color1']);
					$('.td2i').css('border-bottom','1px solid'+undt['R_Color3']);
					$('.rhtprc').text('20%');
					$('.uni-score img').attr('src','.'+undt['R_80p']);
					$('.uni-name').css('color',undt['R_Color1']);$('.uni-name').text(undt['O_RL']);
					$('.uni-rank-text,.uni-rank-title span,.uni-info-title span').css('color',undt['R_Color1']);
					if(Number(dmcntr)>0)
					{
						$('.uni-rank-title').html('<div class="uni-world-rank color2" style="display:none;"><div class="uni-rank-text" ><span id="wrdrnk">World rank</span></div></div><div class="uni-rank color2" style="width: 100%;"><div class="uni-rank-text" style="color: '+undt['R_Color1']+'; text-align: center;"><span style="color: '+undt['R_Color1']+'; text-align: center;">Country rank</span>'+undt['O_RR']+'</div></div>');
					}
					else
					{
					$('.uni-rank-title').html('<div class="uni-world-rank color2"><div class="uni-rank-text" style="color:'+undt['R_Color1']+';"><span id="wrdrnk" style="color: '+undt['R_Color1']+';">World rank</span>'+undt['O_RR']+'</div></div><div class="uni-rank color2"><div class="uni-rank-text" style="color: '+undt['R_Color1']+'; text-align: center;"><span style="color: '+undt['R_Color1']+'; text-align: center;">Country rank</span>'+undt['R_CR']+'</div></div>');
					}
					$('.uni-subinfo-overview h2').css('color',undt['R_Color1']);
					$('.page-header').css('border-bottom','4px solid'+ undt['R_Color1']);
					$('table th').css('color',undt['R_Color1']);
					$('.uni-osninfo').css('background',undt['R_Color4']);
					$('#tblrnk_O_RR img').attr('src','.'+undt['R_Rs']);
					$('#dimhd td').css('color',undt['R_Color1']);
                    $('.page-header:lt(1)').css('border-bottom','none');
		  	    	break;
				case 'I':
					$('#tblrnk_O_WR').css('display','none');$('#tblrnk_O_TR').css('display','none');
					$('#tblrnk_O_RR').css('display','none');$('#tblrnk_O_FR').css('display','none');
					$('.uni-subinfo-img-box:gt(0)').css('display','none');
					$('#txtmiss').css('display','none');
					$('#tblrnk_O_IR').css('font-size','14px');
					$('.az-block-t').css('display','none');$('.az-block-r').css('display','none');$('.az-block-f').css('display','none');
					$('.dimhd').css('color',undt['I_Color1']);
					$('.td2i').css('border-bottom','1px solid'+undt['I_Color3']);
					$('.rhtprc').text('20%');
					$('.uni-score img').attr('src','.'+undt['I_80p']);
					$('.uni-name').css('color',undt['I_Color1']);$('.uni-name').text(undt['O_IL']);
					$('.uni-rank-text,.uni-rank-title span,.uni-info-title span').css('color',undt['I_Color1']);
					if(Number(dmcntr)>0)
					{
						$('.uni-rank-title').html('<div class="uni-world-rank color2" style="display:none;"><div class="uni-rank-text" ><span id="wrdrnk">World rank</span></div></div><div class="uni-rank color2" style="width: 100%;"><div class="uni-rank-text" style="color: '+undt['I_Color1']+'; text-align: center;"><span style="color: '+undt['I_Color1']+'; text-align: center;">Country rank</span>'+undt['O_IR']+'</div></div>');
					}
					else
					{
					$('.uni-rank-title').html('<div class="uni-world-rank color2"><div class="uni-rank-text" style="color:'+undt['I_Color1']+';"><span id="wrdrnk" style="color: '+undt['I_Color1']+';">World rank</span>'+undt['O_IR']+'</div></div><div class="uni-rank color2"><div class="uni-rank-text" style="color: '+undt['I_Color1']+'; text-align: center;"><span style="color: '+undt['I_Color1']+'; text-align: center;">Country rank</span>'+undt['I_CR']+'</div></div>');
					}
					$('.uni-subinfo-overview h2').css('color',undt['I_Color1']);
					$('.page-header').css('border-bottom','4px solid'+ undt['I_Color1']);
					$('table th').css('color',undt['I_Color1']);
					$('.uni-osninfo').css('background',undt['I_Color4']);
					$('#tblrnk_O_IR img').attr('src','.'+undt['I_Is']);
					$('#dimhd td').css('color',undt['I_Color1']);
                    $('.page-header:lt(1)').css('border-bottom','none');
		  	    	break;
				case 'F':
					$('#tblrnk_O_WR').css('display','none');$('#tblrnk_O_TR').css('display','none');
					$('#tblrnk_O_IR').css('display','none');$('#tblrnk_O_RR').css('display','none');
					$('.uni-subinfo-img-box:gt(0)').css('display','none');
					$('#txtmiss').css('display','none');
					$('#tblrnk_O_FR').css('font-size','14px');
					$('.az-block-t').css('display','none');$('.az-block-i').css('display','none');$('.az-block-r').css('display','none');
					$('.dimhd').css('color',undt['F_Color1']);
					$('.td2i').css('border-bottom','1px solid'+undt['F_Color3']);
					$('.rhtprc').text('20%');
					$('.uni-score img').attr('src','.'+undt['F_80p']);
					$('.uni-name').css('color',undt['F_Color1']);$('.uni-name').text(undt['O_FL']);
					$('.uni-rank-text,.uni-rank-title span,.uni-info-title span').css('color',undt['F_Color1']);
					if(Number(dmcntr)>0)
					{
						$('.uni-rank-title').html('<div class="uni-world-rank color2" style="display:none;"><div class="uni-rank-text" ><span id="wrdrnk">World rank</span></div></div><div class="uni-rank color2" style="width: 100%;"><div class="uni-rank-text" style="color: '+undt['F_Color1']+'; text-align: center;"><span style="color: '+undt['F_Color1']+'; text-align: center;">Country rank</span>'+undt['O_FR']+'</div></div>');
					}
					else
					{
					$('.uni-rank-title').html('<div class="uni-world-rank color2"><div class="uni-rank-text" style="color:'+undt['F_Color1']+';"><span id="wrdrnk" style="color: '+undt['F_Color1']+';">World rank</span>'+undt['O_FR']+'</div></div><div class="uni-rank color2"><div class="uni-rank-text" style="color: '+undt['F_Color1']+'; text-align: center;"><span style="color: '+undt['F_Color1']+'; text-align: center;">Country rank</span>'+undt['F_CR']+'</div></div>');
					}
					$('.uni-subinfo-overview h2').css('color',undt['F_Color1']);
					$('.page-header').css('border-bottom','4px solid'+ undt['F_Color1']);
					$('table th').css('color',undt['F_Color1']);
					$('.uni-osninfo').css('background',undt['F_Color4']);
					$('#tblrnk_O_FR img').attr('src','.'+undt['F_Fs']);
					$('#dimhd td').css('color',undt['F_Color1']);
                    $('.page-header:lt(1)').css('border-bottom','none');
		  	    	break;		  	    			  	    	
		  	    default:
				  	$('#tblrnk_O_WR').css('display','');
		  	    	$('#tblrnk_O_TR').css('display','');
		  	    	$('#tblrnk_O_RR').css('display','');
					$('#tblrnk_O_IR').css('display','');
					$('#tblrnk_O_FR').css('display','');
					$('#map').css('display','block');
					$('#txtmiss').css('display','block');
					$('#tblrnk').css('font-size','12px');	
					$('.az-block-t').css('display','block');$('.az-block-i').css('display','block');
					$('.az-block-f').css('display','block');$('.az-block-t').css('display','block');
                    $('.page-header:lt(1)').css('border-bottom','none');
                    $('.uni-subinfo-img-box:gt(0)').css('display','');
				}
		}
	}
	function printdata()
	{
		profdat=new Array();
		var sbjsl=$('#subj :selected').text();
		if(sbjsl=='All Subjects'){sbjsl='Overall';}
		var cntr=$('#cntr :selected').val();
		if(!cntr){cntr=0;}
      	var sdt=$('#years option:selected').text();
		var ur='/final/date-print_prof19c.php'+'/?cntr='+cntr+'&year='+$('#years option:selected').text()+'&subject='+encodeURI(sbjsl)+'&univ_name='+encodeURIComponent($('#university-name').val());
//$('#hdyr').val(ur);
		$.ajax(
		{
	  		url: ur,
	  		success: function(data)
	  	 	{
	  	 		
				$.each(data, function(key, val)
		        {
						profdat[key]=val;
					
				});
				if(Number(sdt)>2021)
                {	
                  if(Number(profdat['O_WR'])>1000)
                    {profdat['O_WR']='1001-1100';}
                    else
                    {
                        if(Number(profdat['O_WR'])>900)
                        {profdat['O_WR']='901-1000';}
                        else
                        {
                            if(Number(profdat['O_WR'])>800)
                            {profdat['O_WR']='801-900';}
                            else{profdat['O_WR']=profdat['O_WR'];}
                        }
                    }
                }
              	else{profdat['O_WR']=profdat['O_WR'];}
              	if(Number(sdt)>2021)
                {
                  if(Number(profdat['O_TR'])>1000)
                  {profdat['O_TR']='1001-1100';}
                  else
                  {
                      if(Number(profdat['O_TR'])>900)
                      {profdat['O_TR']='901-1000';}
                      else
                      {
                          if(Number(profdat['O_TR'])>800)
                          {profdat['O_TR']='801-900';}
                          else{profdat['O_TR']=profdat['O_TR'];}
                      }
                  }
                }
              	else{profdat['O_TR']=profdat['O_TR'];}
              	if(Number(sdt)>2021)
                {
                  if(Number(profdat['O_RR'])>1000)
                  {profdat['O_RR']='1001-1100';}
                  else
                  {
                      if(Number(profdat['O_RR'])>900)
                      {profdat['O_RR']='901-1000';}
                      else
                      {
                          if(Number(profdat['O_RR'])>800)
                          {profdat['O_RR']='801-900';}
                          else{profdat['O_RR']=profdat['O_RR'];}
                      }
                  }
                }
              	else{profdat['O_RR']=profdat['O_RR'];}
              	if(Number(sdt)>2021)
                {
                  if(Number(profdat['O_IR'])>1000)
                  {profdat['O_IR']='1001-1100';}
                  else
                  {
                      if(Number(profdat['O_IR'])>900)
                      {profdat['O_IR']='901-1000';}
                      else
                      {
                          if(Number(profdat['O_IR'])>800)
                          {profdat['O_IR']='801-900';}
                          else{profdat['O_IR']=profdat['O_IR'];}
                      }
                  }
                }
              	else{profdat['O_IR']=profdat['O_IR'];}
              	if(Number(sdt)>2021)
                {
                  if(Number(profdat['O_FR'])>1000)
                  {profdat['O_FR']='1001-1100';}
                  else
                  {
                      if(Number(profdat['O_FR'])>900)
                      {profdat['O_FR']='901-1000';}
                      else
                      {
                          if(Number(profdat['O_FR'])>800)
                          {profdat['O_FR']='801-900';}
                          else{profdat['O_FR']=profdat['O_FR'];}
                      }
                  }
                }
              	else{profdat['O_FR']=profdat['O_FR'];}
				//alert($('#texp_wclr').val());
				$('#pr_uniname').html(profdat['univ_name']);
				$('#pr_uniname').css('color',$('#texp_wclr').val());
				$('#nmwrlg,#wrldrn,#wrldsc').css('color',$('#texp_wclr').val());
				$('#nmwrlg').html('<b>'+profdat['O_OL'].replace(" ", "<br>")+'</b>');
				$('.wrleg img').attr('src','../'+profdat['O_80p']);
				$('#wrldrnv,#wrldscv').css('background',$('#texp_wclr').val());
			/*	if(Number(profdat['O_WR'])>500&&Number(profdat['year'])==2017)
				{
					$('#wrldrnv').html('<b>'+shwgroprank(Number(profdat['O_WR']))+'</b>');
					$('#wrldscv').html('<b>-</b>');
				}
				else{
					$('#wrldrnv').html('<b>'+profdat['O_WR']+'</b>');
					$('#wrldscv').html('<b>'+profdat['O_CR']+'</b>');
				}
			*/	
				$('#wrldrnv').html('<b>'+$('#texp_wr').val()+'</b>');
				if(Number($('#cntr :selected').val())>0)
				{$('#wrldscv').html('<b>'+$('#texp_wr').val()+'</b>');}
				else{$('#wrldscv').html('<b>'+$('#texp_cr').val()+'</b>');				}
				
				$('#fndtpv').html('<b>'+profdat['found']+'</b>');
				$('#shnmpv').html('<b>'+profdat['sh_nm']+'</b>');
				$('#typpv').html('<b>'+profdat['type']+'</b>');
				$('#studpv').html('<b>'+profdat['stud']+'</b>');
				$('#facpv').html('<b>'+profdat['fac']+'</b>');
				$('#facstpv').html('<b>'+profdat['fs']+' : 1</b>');
				$('#wbspv').html('<b>'+profdat['website']+'</b>');
				$('#regpv').html('<b>'+profdat['region']+'</b>');
				$('#locpv').html('<b>'+profdat['loc']+'</b>');
				
				$('.tblrnkhd').css('color',profdat['O_Color1']);
				$('.img_O img').attr('src',profdat['../'+'O_O_s']);
				$('.img_T img').attr('src',profdat['../'+'T_Os']);
				$('.img_R img').attr('src',profdat['../'+'R_Os']);
				$('.img_I img').attr('src',profdat['../'+'I_Os']);
				$('.img_F img').attr('src',profdat['../'+'F_Os']);
	/*			
				if(Number(profdat['O_WR'])>500&&Number(profdat['year'])==2017)
				{
					$('.vlr_O').html('<b>'+shwgroprank(Number(profdat['O_WR']))+'</b>');$('.vlsc_O').html('<b>-</b>');}
				else{$('.vlr_O').html('<b>'+profdat['O_WR']+'</b>');$('.vlsc_O').html('<b>'+profdat['O_WS']+'</b>');}
				if(Number(profdat['O_TR'])>500&&Number(profdat['year'])==2017)
				{$('.vlr_T').html('<b>'+shwgroprank(Number(profdat['O_TR']))+'</b>');$('.vlsc_T').html('<b>-</b>');}
				else{$('.vlr_T').html('<b>'+profdat['O_TR']+'</b>');$('.vlsc_T').html('<b>'+profdat['O_TS']+'</b>');}
				if(Number(profdat['O_RR'])>500&&Number(profdat['year'])==2017)
				{$('.vlr_R').html('<b>'+shwgroprank(Number(profdat['O_RR']))+'</b>');$('.vlsc_R').html('<b>-</b>');}
				else{$('.vlr_R').html('<b>'+profdat['O_RR']+'</b>');$('.vlsc_R').html('<b>'+profdat['O_RS']+'</b>');}
				if(Number(profdat['O_IR'])>500&&Number(profdat['year'])==2017)
				{$('.vlr_I').html('<b>'+shwgroprank(Number(profdat['O_IR']))+'</b>');$('.vlsc_I').html('<b>-</b>');}
				else{$('.vlr_I').html('<b>'+profdat['O_IR']+'</b>');$('.vlsc_I').html('<b>'+profdat['O_IS']+'</b>');}				
				if(Number(profdat['O_FR'])>500&&Number(profdat['year'])==2017)
				{$('.vlr_F').html('<b>'+shwgroprank(Number(profdat['O_FR']))+'</b>');$('.vlsc_F').html('<b>-</b>');}
				else{$('.vlr_F').html('<b>'+profdat['O_FR']+'</b>');$('.vlsc_F').html('<b>'+profdat['O_FS']+'</b>');}		
	*/			
				$('.vlr_O').html('<b>'+profdat['O_WR']+'</b>');$('.vlsc_O').html('<b>'+profdat['O_WS']+'</b>');
				$('.vlr_T').html('<b>'+profdat['O_TR']+'</b>');$('.vlsc_T').html('<b>'+profdat['O_TS']+'</b>');
				$('.vlr_R').html('<b>'+profdat['O_RR']+'</b>');$('.vlsc_R').html('<b>'+profdat['O_RS']+'</b>');		
				$('.vlr_I').html('<b>'+profdat['O_IR']+'</b>');$('.vlsc_I').html('<b>'+profdat['O_IS']+'</b>');
				$('.vlr_F').html('<b>'+profdat['O_FR']+'</b>');$('.vlsc_F').html('<b>'+profdat['O_FS']+'</b>');
				
				/*$('.repp_r').html('<b>'+$('#reprnk').text()+'</b>');
				$('.repp_sc').html('<b>'+$('#repscr').text()+'</b>');
				$('.prrepp_r').html('<b>'+$('#resrnk').text()+'</b>');
				$('.prrepp_sc').html('<b>'+$('#resscr').text()+'</b>');	*/
				
				$('.repp_r').html('<b>'+$('#repscr').text()+'</b>');
				$('.repp_sc').html('<b>'+$('#reprnk').text()+'</b>');
				$('.prrepp_r').html('<b>'+$('#resscr').text()+'</b>');
				$('.prrepp_sc').html('<b>'+$('#resrnk').text()+'</b>');	
			}
			
		});
		
	}
	function viewsubjects()
	{
		var strloc=document.location.pathname;
		if(strloc.slice(-7)=='-s.html')   
		{
					
                 /* $('#subj option[value="SH"]').css('display','none');
					$('#subj option[value="SL"]').css('display','none');
					$('#subj option[value="SM"]').css('display','none');
					$('#subj option[value="SN"]').css('display','none');
					$('#subj option[value="SS"]').css('display','none');
					$('#subj option[value="SE"]').css('display','none');
					$('#subj option[value="SO"]').prop('selected','selected');
                   
                    $('#subj option[value="SE"]').prop('selected','selected');*/
                
                  	$('.header-top').css('display','none');
				}
		else
		{
          			    /*
                        $('#subj option[value="SH"]').css('display','inline-block');
					$('#subj option[value="SL"]').css('display','inline-block');
					$('#subj option[value="SM"]').css('display','inline-block');
					$('#subj option[value="SN"]').css('display','inline-block');
					$('#subj option[value="SS"]').css('display','inline-block');
					$('#subj option[value="SE"]').css('display','inline-block');
					$('#subj option[value="SO"]').css('display','inline-block');
                 	//$('#subj option[value="SE"]').prop('selected','selected');
                  	//$('.header-top').css('display','block');*/
             		$('.header-top').css('display','block');
          
		} 
	}
	function viewsearch()
	{
		var yr=$('#years option:selected').text();
		var sb=$('.az-subject-sort').val();
		var dm=$('.az-ranking-sort').val();
		var cn=$('.az-country-sort').val();
		var lcsrh=String(window.location.search);
		var nwlcsrh='?sort='+dm+'&year=' +yr+'&subject='+sb+'&cntr='+cn;
		//alert(yr+'\n'+dm+'\n'+sb+'\n'+lcsrh+'\n'+nwlcsrh);
		if(lcsrh!=nwlcsrh)
		{
			window.location.search=nwlcsrh;
		}
	}
	function subjectview()
	{
		if(Number($('#years option:selected').text())==2022||Number($('#years option:selected').text())<2014)
		{	
			if(Number($('#years option:selected').text())==2022)
			{
				//$('.az-subject-sort [value="SH"]').remove();
				//$('.az-subject-sort [value="SL"]').remove();
				//$('.az-subject-sort [value="SM"]').remove();
				//$('.az-subject-sort [value="SN"]').remove();
				//$('.az-subject-sort [value="SS"]').remove();
				//$('.az-subject-sort [value="SE"]').remove();
				/*$('.az-subject-sort [value="SH"]').remove();
				$('.az-subject-sort [value="SS"]').remove();
				$('.az-subject-sort [value="SL"]').remove();
				$('.az-subject-sort [value="SM"]').remove();*/
				//$('.az-subject-sort [value="SN"]').remove();
				//$('.az-subject-sort [value="SE"]').remove();
				//if(!$('.az-subject-sort [value="SH"]').val())
               // {$('.az-subject-sort').append('<option value="SH">Humanities</option>');}
               // if(!$('.az-subject-sort [value="SL"]').val())
               // {$('.az-subject-sort').append('<option value="SL">Life Sciences</option>');}
               // if(!$('.az-subject-sort [value="SM"]').val())
               // {$('.az-subject-sort').append('<option value="SM">Medical Sciences</option>');}
               // if(!$('.az-subject-sort [value="SN"]').val())
               // {$('.az-subject-sort').append('<option value="SN">Natural Sciences</option>');}
               // if(!$('.az-subject-sort [value="SS"]').val())
               // {$('.az-subject-sort').append('<option value="SS">Social Sciences</option>');}
               /// if(!$('.az-subject-sort [value="SE"]').val())
              //  {$('.az-subject-sort').append('<option value="SE">Technical Sciences</option>');}
               //$('.az-subject-sort [value="SO"]').prop('selected','selected');
			}
			else
			{
				$('.az-subject-sort [value="SO"]').prop('selected','selected');
				$('.az-subject-sort [value="SH"]').remove();
				$('.az-subject-sort [value="SL"]').remove();
				$('.az-subject-sort [value="SM"]').remove();
				$('.az-subject-sort [value="SN"]').remove();
				$('.az-subject-sort [value="SS"]').remove();
				$('.az-subject-sort [value="SE"]').remove();
			}
			
		}
		else
		{
			if(!$('.az-subject-sort [value="SH"]').val())
			{$('.az-subject-sort').append('<option value="SH">Humanities</option>');}
			if(!$('.az-subject-sort [value="SL"]').val())
			{$('.az-subject-sort').append('<option value="SL">Life Sciences</option>');}
			if(!$('.az-subject-sort [value="SM"]').val())
			{$('.az-subject-sort').append('<option value="SM">Medical Sciences</option>');}
			if(!$('.az-subject-sort [value="SN"]').val())
			{$('.az-subject-sort').append('<option value="SN">Natural Sciences</option>');}
			if(!$('.az-subject-sort [value="SS"]').val())
			{$('.az-subject-sort').append('<option value="SS">Social Sciences</option>');}
			if(!$('.az-subject-sort [value="SE"]').val())
			{$('.az-subject-sort').append('<option value="SE">Technical Sciences</option>');}
		}
	} 
	function datatoprint()
	{
		$('#flagp').prop('src','../'+profdat['flag']);
		$('#logop').prop('src','../'+profdat['logo']);
		$('#cntrp').html(profdat['country']);
		//$('#cntrp').css('color',profdat['O_Color1']);
		$('#cntrp').css('color',$('#texp_wclr').val());
		$('#addrp').html(profdat['addr']);
		//$('.midlprofn').css('color',profdat['O_Color1']);
		$('.midlprofn').css('color',$('#texp_wclr').val());
		$('.indnkn').css('border-bottom','1px solid '+profdat['O_Color2']);
		$('.reprnkblockp_T').css('background',profdat['T_Color3']);
		$('#wr_tvp').html('<b>'+profdat['O_TR']+'</b>');
		$('#cr_tvp').html('<b>'+profdat['T_CR']+'</b>');
		$('#sc_tvp').html('<b>'+profdat['O_TS']+'</b>');
		$('#lg_tvp').html('<b>'+profdat['O_TL']+'</b>');	
		$('.reprnkblockp_R').css('background',profdat['R_Color3']);
		$('#wr_rvp').html('<b>'+profdat['O_RR']+'</b>');
		$('#cr_rvp').html('<b>'+profdat['R_CR']+'</b>');
		$('#sc_rvp').html('<b>'+profdat['O_RS']+'</b>');				
		$('#lg_rvp').html('<b>'+profdat['O_RL']+'</b>');
		$('.reprnkblockp_I').css('background',profdat['I_Color3']);
		$('#wr_ivp').html('<b>'+profdat['O_IR']+'</b>');
		$('#cr_ivp').html('<b>'+profdat['I_CR']+'</b>');
		$('#sc_ivp').html('<b>'+profdat['O_IS']+'</b>')				
		$('#lg_ivp').html('<b>'+profdat['O_IL']+'</b>');
		
		$('.reprnkblockp_F').css('background',profdat['F_Color3']);
		$('#wr_fvp').html('<b>'+profdat['O_FR']+'</b>');
		$('#cr_fvp').html('<b>'+profdat['F_CR']+'</b>');
		$('#sc_fvp').html('<b>'+profdat['O_FS']+'</b>');				
		$('#lg_fvp').html('<b>'+profdat['O_FL']+'</b>');	
		
		$('.pover').html('<img src="" alt="" class="imgov"/>'+profdat['over']);	
		$('.imgov').prop('src','../'+profdat['pic1']);
		$('.hdover').css('color',$('#texp_wclr').val());					
		$('.hdms').css('color',$('#texp_wclr').val());
		$('.pmiss').html('<img src="" alt="" class="imgms"/>'+profdat['miss']);	
		$('.imgms').prop('src','../'+profdat['pic2']);
		$('#pryr').html(profdat['year']);$('#pryr1').html(profdat['year']);$('#pryr2').html(profdat['year']);
		$('#prsb').html(profdat['subj']);$('#prsb1').html(profdat['subj']);$('#prsb2').html(profdat['subj']);
		switch (profdat['O_TL'])
		{
	  	case ('Diamond League'):$('#piechart_T img').attr('src','../images/T_D.jpg');break;
		case ('Golden League'):$('#piechart_T img').attr('src','../images/T_G.jpg');break;
		case ('Silver League'):$('#piechart_T img').attr('src','../images/T_S.jpg');break;
		case ('Bronze League'):$('#piechart_T img').attr('src','../images/T_B.jpg');break;
		case ('Copper League'):$('#piechart_T img').attr('src','../images/T_C.jpg');break;	
		case ('World League'):$('#piechart_T img').attr('src','../images/T_W.jpg');break;	
		default:	$('#piechart_T img').attr('src','../images/T_D.jpg');				
		}
		switch (profdat['O_RL'])
		{
	  	case ('Diamond League'):$('#piechart_R img').attr('src','../images/R_D.jpg');break;
		case ('Golden League'):$('#piechart_R img').attr('src','../images/R_G.jpg');break;
		case ('Silver League'):$('#piechart_R img').attr('src','../images/R_S.jpg');break;
		case ('Bronze League'):$('#piechart_R img').attr('src','../images/R_B.jpg');break;
		case ('Copper League'):$('#piechart_R img').attr('src','../images/R_C.jpg');break;	
		case ('World League'):$('#piechart_R img').attr('src','../images/R_W.jpg');break;	
		default:	$('#piechart_R img').attr('src','../images/R_D.jpg');				
		}
		switch (profdat['O_IL'])
		{
	  	case ('Diamond League'):$('#piechart_I img').attr('src','../images/I_D.jpg');break;
		case ('Golden League'):$('#piechart_I img').attr('src','../images/I_G.jpg');break;
		case ('Silver League'):$('#piechart_I img').attr('src','../images/I_S.jpg');break;
		case ('Bronze League'):$('#piechart_I img').attr('src','../images/I_B.jpg');break;
		case ('Copper League'):$('#piechart_I img').attr('src','../images/I_C.jpg');break;	
		case ('World League'):$('#piechart_I img').attr('src','../images/I_W.jpg');break;	
		default:	$('#piechart_I img').attr('src','../images/I_D.jpg');				
		}
		switch (profdat['O_FL'])
		{
	  	case ('Diamond League'):$('#piechart_F img').attr('src','../images/F_D.jpg');break;
		case ('Golden League'):$('#piechart_F img').attr('src','../images/F_G.jpg');break;
		case ('Silver League'):$('#piechart_F img').attr('src','../images/F_S.jpg');break;
		case ('Bronze League'):$('#piechart_F img').attr('src','../images/F_B.jpg');break;
		case ('Copper League'):$('#piechart_F img').attr('src','../images/F_C.jpg');break;	
		case ('World League'):$('#piechart_F img').attr('src','../images/F_W.jpg');break;	
		default:	$('#piechart_F img').attr('src','../images/F_D.jpg');				
		}
		$('#pind4').html($('#pind4').html());
					
						
		$('#indnm1').html($('.az-block-t > .uni-block-right >table>tbody .td2 .indlftnm').html());
		//$('#indnm1').css('background',profdat['T_Color3']);
		$('#indnm2').html($('.az-block-t > .uni-block-right >table>tbody>tr:gt(0) .indlftnm').html());
		$('#indnm3').html($('.az-block-t > .uni-block-right >table>tbody>tr:gt(1) .indlftnm').html());
		//$('#indnm3').css('background',profdat['T_Color3']);
		$('#indnm4').html($('.az-block-t > .uni-block-right >table>tbody>tr:gt(2) .indlftnm').html());
		$('#indnm5').html($('.az-block-t > .uni-block-right >table>tbody>tr:gt(3) .indlftnm').html());
		$('#tr1,#tr3,#tr5').css('background',profdat['T_Color3']);
		
		$('#indnm6').html($('.az-block-r > .uni-block-right >table>tbody .td2 .indlftnm').html());
		$('#indnm7').html($('.az-block-r > .uni-block-right >table>tbody>tr:gt(0) .indlftnm').html());
		$('#indnm8').html($('.az-block-r > .uni-block-right >table>tbody>tr:gt(1) .indlftnm').html());
		$('#indnm9').html($('.az-block-r > .uni-block-right >table>tbody>tr:gt(2) .indlftnm').html());
		$('#indnm10').html($('.az-block-r > .uni-block-right >table>tbody>tr:gt(3) .indlftnm').html());
		$('#tr6,#tr8,#tr10').css('background',profdat['R_Color3']);
		
		$('#indnm11').html($('.az-block-i > .uni-block-right >table>tbody .td2 .indlftnm').html());
		$('#indnm12').html($('.az-block-i > .uni-block-right >table>tbody>tr:gt(0) .indlftnm').html());
		$('#indnm13').html($('.az-block-i > .uni-block-right >table>tbody>tr:gt(1) .indlftnm').html());
		$('#indnm14').html($('.az-block-i > .uni-block-right >table>tbody>tr:gt(2) .indlftnm').html());
		$('#indnm15').html($('.az-block-i > .uni-block-right >table>tbody>tr:gt(3) .indlftnm').html());
		$('#tr11,#tr13,#tr15').css('background',profdat['I_Color3']);
		
		$('#indnm16').html($('.az-block-f > .uni-block-right >table>tbody .td2 .indlftnm').html());
		$('#indnm17').html($('.az-block-f > .uni-block-right >table>tbody>tr:gt(0) .indlftnm').html());
		$('#indnm18').html($('.az-block-f > .uni-block-right >table>tbody>tr:gt(1) .indlftnm').html());
		$('#indnm19').html($('.az-block-f > .uni-block-right >table>tbody>tr:gt(2) .indlftnm').html());
		$('#indnm20').html($('.az-block-f > .uni-block-right >table>tbody>tr:gt(3) .indlftnm').html());	
		$('#tr16,#tr18,#tr20').css('background',profdat['F_Color3']);		
		
//			var printing_css='<link rel="stylesheet"  media=print href="./templates/rur/css/print.css" type="text/css" />';	
			var prtxt_css='.prophprint { 	font-family: Areal; 	width: 100%; } .hdsplt { 	height: 40px; 	width: auto; 	display: block; } .clpryr { 	position: relative; 	display: inline-block; 	float: left; } .clprsb { 	position: relative; 	display: inline-block; 	float: right; } .pagesplit { 	page-break-before: always; } #pr_uniname { 	font-family: Areal; 	text-align: center; } .hdld { 	display: block; 	margin: auto; 	width: 750px; 	height: 68px; } .wrdr { 	position: relative; 	text-align: center; 	float: left; 	width: 280px; 	vertical-align: middle; 	padding-top: 10px; 	margin-left: -20px; } .wrleg { 	display: block; 	position: relative; 	float: right; 	text-align: center; 	width: 220px; 	top: 3px; 	font-size: 24px; } .wrleg img { 	width: 50px; 	float: right; 	margin-right: 18px; } #nmwrlg { 	width: 38px; 	height: auto; 	margin-left: 12px; } .cntrr { 	display: block; 	position: relative; 	text-align: center; 	margin-left: 250px; 	width: 220px; 	vertical-align: baseline; } #wrldrn { 	display: inline-block; 	position: relative; 	float: left; 	vertical-align: middle; 	padding-left: 60px; 	font-size: 24px; } #wrldsc { 	display: inline-block; 	position: relative; 	float: left; 	top: 10px; 	padding-left: 45px; 	font-size: 24px; } #wrldrnv { 	display: inline-block; 	position: relative; 	float: right; 	vertical-align: middle; 	margin-right: 35px; 	width: 103px; 	height: 37px; 	font-size: 26px; 	padding-top: 5px; 	color: #fff; 	padding-left: 2px; } #wrldscv { 	display: inline-block; 	position: relative; 	float: right; 	vertical-align: middle; 	top: 10px; 	margin-right: 35px; 	width: 40px; 	height: 40px; 	font-size: 26px; 	padding-top: 5px; 	color: #fff; 	padding-left: 2px; } .logoflag { 	width: 700px; 	margin: auto; 	height: 150px; } .logoflag img { 	width: 120px; 	height: 120px; } #logop { 	display: block; 	height: 120px; 	width: 120px; 	position: relative; 	float: left; 	top: 5px; 	left: 5px; } #flagp { 	height: 120px; 	width: 160px; 	position: relative; 	float: right; 	margin-right: -5px; 	top: 5px; } .adrpr { 	display: block; 	position: relative; 	height: 125px; 	width: 370px; 	top: 5px; 	left: -15px; 	margin: auto; 	text-align: center; } .adrpr h2 { 	text-align: center; } .topmainpr { 	display: block; 	position: relative; 	width: 760px; 	margin: auto; 	height: 600px; 	border: none; 	top: 20px; } .lftman { 	position: relative; 	display: block; 	width: 350px; 	height: 540px; 	top: 60px; 	float: left; 	margin-left: 2px; 	border: none; } #fndtp,#shnmp,#typp,#studp,#facp,#facstp,#wbsp,#regp,#locp { 	display: inline-block; 	position: relative; 	float: left; 	padding-left: 10px; 	width: 340px; 	padding-top: 1px; 	vertical-align: bottom; } #fndtpv,#shnmpv,#typpv,#studpv,#facpv,#facstpv,#wbspv,#regpv,#locpv { 	display: inline-block; 	position: relative; 	padding-left: 165px; 	padding-top: 5px; 	font-size: 22px; 	top: -29px; 	text-align: left; } #wbspv { 	margin-left: -85px; 	text-overflow: ellipsis; 	white-space: wrap; 	overflow: hidden; } .rhtman { 	position: relative; 	display: block; 	width: 400px; 	height: 590px; 	top: 3px; 	float: right; 	margin-right: 2px; 	border: none; 	background: #fff; } .tblrnkhd { 	display: block; 	position: relative; 	margin: auto; 	font-size: 18px; 	width: 390px; 	height: 30px; 	border: none; 	padding-top: 15px; } .tdh0 { 	width: 25px; 	float: left; 	margin-left: 3px; 	text-align: center; } .tdh1 { 	width: 210px; 	text-align: left; 	float: left; 	margin-left: 45px; } .tdh2 { 	width: 80px; 	text-align: center; 	float: left; 	margin-left: -15px; } .tdh3 { 	width: 40px; 	text-align: center; 	float: left; 	margin-left: 30px; } .rep { 	display: block; 	float: left; 	margin-left: 23px; } .repr { 	display: block; 	margin-left: 10px; } .repsc { 	display: block; 	margin-left: 23px; } .tblrnkhdvl { 	display: block; 	position: relative; 	margin: auto; 	font-size: 18px; 	top: 3px; 	font-size: 18px; 	width: 390px; 	height: 40px; 	border: none; 	padding-top: 12px; } .img_O,.img_T,.img_R,.img_I,.img_F { 	width: 25px; 	float: left; 	margin-left: 3px; 	text-align: center; } .sb_O,.sb_T,.sb_R,.sb_I,.sb_F { 	width: 210px; 	text-align: left; 	float: left; 	margin-left: 20px; } .vlr_O,.vlr_T,.vlr_R,.vlr_I,.vlr_F { 	width: 90px; 	text-align: center; 	float: left; 	margin-left: -14px; } .vlsc_O,.vlsc_T,.vlsc_R,.vlsc_I,.vlsc_F { 	width: 40px; 	text-align: center; 	float: left; 	margin-left: 16px; } .hrr { 	display: block; 	width: 95%; 	color: #111111; 	padding-left: 10px; 	margin-top: 20px; } .repp,.prrepp { 	width: 235px; 	text-align: left; 	float: left; 	margin-left: 15px; } .repp_sc,.prrepp_sc { 	width: 90px; 	text-align: center; 	float: left; 	margin-left: -15px; } .repp_r,.prrepp_r { 	width: 40px; 	text-align: center; 	float: right; 	margin-left: 16px; } .midlprof { 	display: block; 	position: relative; 	width: 90%; 	height: 85px; 	margin-top: 1px; 	margin: auto; } .midblhd { 	color: #2580da; 	text-align: center; 	font-size: 18px; 	margin-top: 1px; 	padding-top: 1px; } .reprnkblock,.whtrnkblock,.indrnkblock,.repcrnkblock { 	display: inline-block; 	position: relative; 	float: left; 	margin-left: 5px; 	width: 240px; 	height: 50px; 	top: 5px; 	padding-top: 8px; 	padding-bottom: -5px; } .reprnkblock { 	margin-left: 5px; 	width: 240px; } .whtrnkblock { 	margin-left: 1px; 	width: 120px; } .indrnkblock { 	margin-left: 1px; 	width: 45%; } .repcrnkblock { 	/*position: relative;*/ 	display: block; 	margin-left: 10px; 	width: 120px; 	top: 28px; } .repblockp_T { 	display: block; 	position: relative; 	width: 98%; 	height: 145px; 	border: 1px solid #e2e2e2; 	margin-top: 0px; 	margin: auto; 	padding-top: 5px; } .reprnkblockp_T,.whtrnkblockp_T,.indrnkblockp_T,.repcrnkblockp_T { 	display: block; 	position: relative; 	float: left; 	margin-left: 0px; 	height: 140px; 	top: 2px; 	padding-top: 1px; 	padding-bottom: -5px; } .reprnkblockp_T { 	margin-left: 0px; 	width: 31.4%; 	margin-top: -3px; 	background: #d1eafc; } .whtrnkblockp_T { 	margin-left: 1px; 	width: 90px; 	padding-top: 1px; } .indrnkblockp_T { 	margin-left: 1px; 	width: 52%; 	padding-top: 1px; } .repcrnkblockp_T { 	margin-left: 1px; 	width: 70px; 	padding-top: 1px; } .captr_p { 	display: inline-block; 	position: relative; 	width: 98%; 	float: left; 	padding-left: 15px; 	font-size: 18px; 	top: 10px; } .nmpar_r { 	display: inline-block; 	position: relative; 	width: 100px; 	float: left; 	margin-left: 3px; 	vertical-align: middle; } .rank_valp { 	display: inline-block; 	position: absolute; 	float: left; 	margin-left: 5px; 	vertical-align: middle; } .wr_T,.cr_T,.sc_T,.lg_T { 	display: block; 	position: relative; 	height: 22.5px; 	margin-top: 1px; 	margin: auto; 	vertical-align: middle; 	text-align: left; } .indnmp { 	display: block; 	position: relative; 	height: auto; 	margin-top: 1px; 	text-align: left; 	vertical-align: middle; 	padding-left: 5px; 	width: auto; 	float: left; } .indwtp { 	display: block; 	position: relative; 	height: auto; 	margin-top: 1px; 	text-align: left; 	vertical-align: middle; 	padding-left: 5px; 	width: auto; 	float: left; } .indnmp span { 	position: relative; 	display: inline-block; 	vertical-align: bottom; } .percrnp { 	display: block; 	position: relative; 	margin-top: 1px; 	text-align: right; 	vertical-align: middle; 	padding-left: 0px; 	width: auto; 	height: 20px; 	float: left; } .perdgrm { 	display: block; 	position: relative; 	vertical-align: bottom; 	text-align: center; 	font-size: 22px; 	margin: auto; 	top: 0px; } .charrnkp { 	display: block; 	position: relative; 	height: 95px; 	text-align: center; 	vertical-align: top; 	padding-left: 0px; 	padding-top: 10px; 	width: 90px; 	z-index: -88; } .repblockp_R { 	display: block; 	position: relative; 	width: 98%; 	height: 145px; 	border: 1px solid #e2e2e2; 	margin-top: 0px; 	margin: auto; 	padding-top: 5px; } .reprnkblockp_R,.whtrnkblockp_R,.indrnkblockp_R,.repcrnkblockp_R { 	display: block; 	position: relative; 	float: left; 	margin-left: 5px; 	height: 140px; 	top: 2px; 	padding-top: 1px; 	padding-bottom: -5px; } .reprnkblockp_R { 	margin-left: 0px; 	width: 31.4%; 	margin-top: -3px; 	background: #d1eafc; } .whtrnkblockp_R { 	margin-left: 1px; 	width: 90px; 	padding-top: 1px; } .indrnkblockp_R { 	margin-left: 1px; 	width: 52%; 	padding-top: 1px; } .repcrnkblockp_R { 	margin-left: 1px; 	width: 70px; 	padding-top: 1px; } .wr_R,.cr_R,.sc_R,.lg_R { 	display: block; 	position: relative; 	height: 22.5px; 	margin-top: 1px; 	margin: auto; 	vertical-align: middle; 	text-align: left; } .repblockp_I { 	display: block; 	position: relative; 	width: 98%; 	height: 145px; 	border: 1px solid #e2e2e2; 	margin-top: 0px; 	margin: auto; 	padding-top: 5px; } .reprnkblockp_I,.whtrnkblockp_I,.indrnkblockp_I,.repcrnkblockp_I { 	display: block; 	position: relative; 	float: left; 	margin-left: 5px; 	height: 140px; 	top: 2px; 	padding-top: 1px; 	padding-bottom: -5px; } .reprnkblockp_I { 	margin-left: 0px; 	width: 31.4%; 	margin-top: -3px; 	background: #d1eafc; } .whtrnkblockp_I { 	margin-left: 1px; 	width: 90px; 	padding-top: 1px; } .indrnkblockp_I { 	margin-left: 1px; 	width: 52%; 	padding-top: 1px; } .repcrnkblockp_I { 	margin-left: 1px; 	width: 70px; 	padding-top: 1px; } .wr_I,.cr_I,.sc_I,.lg_I { 	display: block; 	position: relative; 	height: 22.5px; 	margin-top: 1px; 	margin: auto; 	vertical-align: middle; 	text-align: left; } .repblockp_F { 	display: block; 	position: relative; 	width: 98%; 	height: 145px; 	border: 1px solid #e2e2e2; 	margin-top: 0px; 	margin: auto; 	padding-top: 5px; } .reprnkblockp_F,.whtrnkblockp_F,.indrnkblockp_F,.repcrnkblockp_F { 	display: block; 	position: relative; 	float: left; 	margin-left: 5px; 	height: 140px; 	top: 2px; 	padding-top: 1px; 	padding-bottom: -5px; } .reprnkblockp_F { 	margin-left: 0px; 	width: 31.4%; 	margin-top: -3px; 	background: #d1eafc; } .whtrnkblockp_F { 	margin-left: 1px; 	width: 90px; 	padding-top: 1px; } .indrnkblockp_F { 	margin-left: 1px; 	width: 52%; 	padding-top: 1px; } .repcrnkblockp_F { 	margin-left: 1px; 	width: 70px; 	padding-top: 1px; } .wr_F,.cr_F,.sc_F,.lg_F { 	display: block; 	position: relative; 	height: 22.5px; 	margin-top: 1px; 	margin: auto; 	vertical-align: middle; 	text-align: left; } .overw { 	display: block; 	position: relative; 	width: 750px; 	height: auto; 	padding: 10 10 10 10; 	text-align: justify; } .imgov { 	width: auto; 	height: auto; 	float: left; 	margin: 7px 7px 7px 7px; } .hdover { 	text-align: center; } .missw { 	display: block; 	position: relative; 	width: 750px; 	height: auto; 	padding: 10 10 10 10; 	text-align: justify; } .imgms { 	width: auto; 	height: auto; 	float: left; 	margin: 7px 7px 7px 7px; } .hdms { 	text-align: center; } .midlprofn { 	position: relative; 	display: block; 	width: 99%; 	height: 90px; 	margin: auto; 	color: #035ef3; } .reprnkblockn { 	position: relative; 	display: block; 	width: 30%; 	float: left; 	margin-left: 5px; 	height: 85px; 	margin-top: 1px; } .whtrnkblockn { 	position: relative; 	display: block; 	width: 9%; 	float: left; 	margin-left: 5px; 	height: 85px; 	margin-top: 1px; 	text-align: center; } .indrnkblockn { 	position: relative; 	display: block; 	width: 58%; 	float: right ; 	margin-right: 5px; 	height: 85px; 	margin-top: 5px; } .indnkn { 	position: relative; 	display: block; 	width: 98%; 	margin: auto; 	height: 35px; 	margin-top: 5px; 	border-bottom: 1px solid #F00; 	text-align: center; } .indnknmn { 	position: relative; 	display: block; 	width: 98%; 	margin: auto; 	height: 32px; 	margin-top: 1px; 	margin-top: 5px; } .indktnmn { 	position: relative; 	display: block; 	float: left; 	width: 70%; 	margin-left: 1px; 	margin-top: 1px; 	word-wrap: break-word; } .indktwhtn { 	position: relative; 	display: block; 	float: left; 	width: 7%; 	margin-left: 1px; 	margin-top: 7px; 	height: 30px; 	text-align: left; 	transform: rotate(-30grad); } .indktrnkn { 	position: relative; 	display: block; 	float: left; 	width: 7%; 	padding-left: 15px; 	margin-top: 10px; 	height: 30px; 	text-align: left; 	transform: rotate(-30grad); } .indktscrn { 	position: relative; 	display: block; 	float: right; 	width: 8%; 	margin-right: 5px; 	margin-top: 1px; 	text-align: left; 	transform: rotate(-30grad); }';
		setTimeout(function()
		{
		var html_to_print='<style>'+prtxt_css+'</style>' + $('.prophprint').html();
		var iframe=$('<iframe id="print_frame">'); // создаем iframe в переменную
		$('body').append(iframe); //добавляем эту переменную с iframe в наш body (в самый конец)
		var doc = $('#print_frame')[0].contentDocument || $('#print_frame')[0].contentWindow.document;
		var win = $('#print_frame')[0].contentWindow || $('#print_frame')[0];
		doc.getElementsByTagName('body')[0].innerHTML=html_to_print;
		win.print();
		$('iframe').remove();},1500);
	}
	function datatopdf()
	{
		var i=0;tdpdf=Array;var pfdstr='';
		/*0 - Наименование вуза*/
		tdpdf[i]=$('.uni-info-title').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*1 - Цвет лиги*/
		i++;
		//tdpdf[i]=$('#exp_w_clr').css('color');
		//tdpdf[i]=$('.uni-info-title span').css('color');
		//alert($('.cdttexp').css('color'));
		tdpdf[i]=$('.cdttexp').css('color');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*2 - Логотип вуза*/
		i++;
		tdpdf[i]=$('.uni-logo img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*3 - Флаг страны*/
		i++;
		tdpdf[i]=$('.uni-flag img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*4 - Ранг*/
		i++;
		if(Number($('#cntr :selected').val())>0)
		{tdpdf[i]=$('#texp_wr').val();}
		else{tdpdf[i]=$('#texp_wr').val();}
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*5 - Ранг по стране*/
		i++;
		if(Number($('#cntr :selected').val())>0)
		{tdpdf[i]=$('#texp_wr').val();}
		else{tdpdf[i]=$('#texp_cr').val();}
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*6 - Название лиги*/
		i++;
		tdpdf[i]=$('.uni-name').text();
		//tdpdf[i]=tdpdf[i].replace('Country rank','');
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*7 - Рисунок Лиги*/
		i++;
		tdpdf[i]=$('.uni-score img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*8 - Субъект*/
		i++;
		tdpdf[i]=$('#subj :selected').val();
		var sbbm={'SO':'RUR World University Ranking','SH':'RUR Humanities','SL':'RUR Life Sciences','SM':'RUR Medical Sciences','SN':'RUR Natural Sciences','SS':'RUR Social Sciences','SE':'RUR Technical Sciences'};
		pfdstr=pfdstr+sbbm[tdpdf[i]]+'|'; 
		/*9 - Год*/
		i++;
		tdpdf[i]=$('.points .active .point-text').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*10 - Foundation year:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:lt(1)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*11 -World University Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_WR td:gt(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*12 - -World University Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_WR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*13-Short name:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*14 -Teaching Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*15 -Teaching Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*16 - -Teaching Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*17-Type:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(6)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*18 -Research Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*19 -Research Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*20 - -Research Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*21-Students:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(8)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*22 -International Diversity Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*23 -International Diversity Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*24 - -International Diversity Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*25-Faculty:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(10)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*26 -Financial Sustainability Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*27 -Financial Sustainability Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*28 - -Financial Sustainability Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*29-Faculty/Students Ratio:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(12)').text()+$('.uni-info-list dt:nth-child(13)').text()+$('.uni-info-list dt:nth-child(14)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*30-Web-site:*/
		i++;
		tdpdf[i]=$('.uni-info-list a').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*31-Web-site: Link*/
		i++;
		tdpdf[i]=$('.uni-info-list a').attr('href');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*32-Region:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(18)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*33-Reputation Rankings - rank*/
		i++;
		tdpdf[i]=$('#reprnk').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*34-Reputation Rankings - score*/
		i++;
		tdpdf[i]=$('#repscr').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*35-Location:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:last').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*36-Academic Rankings - rank*/
		i++;
		tdpdf[i]=$('#resrnk').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*37-Academic Rankings - score*/
		i++;
		tdpdf[i]=$('#resscr').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*38-T-color*/
		i++;
		tdpdf[i]=$('.az-block-t div:first').css('background-color');
		/*tdpdf[i]=$('.az-block-t div:first').attr('style');
		var hcol= tdpdf[i].split(':');
		tdpdf[i]=hcol[1].slice(0,-1);
		alert(tdpdf[i]);
		var rgbObj = hexToRgb(tdpdf[i]);
		tdpdf[i]=('rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'); 
		tdpdf[i]='rgb(219,243,206)';*/
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*39-IR-1*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*40-OI-1*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*41-T-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-t div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*42-T-League:*/
		i++;
		tdpdf[i]=$('.az-block-t div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*43-IR-2*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*44-OI-2*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*45-IR-3*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*46-OI-3*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*47-IR-4*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*48-OI-4*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*49-IR-5*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*50-OI-5*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*51 - TEACHING RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart1 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		
		/*52-R-color*/
		i++;
		tdpdf[i]=$('.az-block-r div:first').css('background-color');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*53-IR-6*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*54-OI-6*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*55-R-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-r div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*56-R-League:*/
		i++;
		tdpdf[i]=$('.az-block-r div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*57-IR-7*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*58-OI-7*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*59-IR-8*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*60-OI-8*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*61-IR-9*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*62-OI-9*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*63-IR-10*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*64-OI-10*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*65 - RESEARCH RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart2 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 

		/*66-I-color*/
		i++;
		tdpdf[i]=$('.az-block-i div:first').css('background-color');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*67-IR-11*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*68-OI-11*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*69-R-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-i div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*70-R-League:*/
		i++;
		tdpdf[i]=$('.az-block-i div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*71-IR-12*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*72-OI-12*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*73-IR-13*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*74-OI-13*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*75-IR-14*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*76-OI-14*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*77-IR-15*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*78-OI-15*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*79 - NTERNATIONAL DIVERSITY RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart3 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 

		/*80-F-color*/
		i++;
		tdpdf[i]=$('.az-block-f div:first').css('background-color');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*81-IR-16*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*82-OI-16*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*83-F-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-f div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*84-F-League:*/
		i++;
		tdpdf[i]=$('.az-block-f div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*85-IR-17*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*86-OI-17*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*87-IR-18*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*88-OI-18*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*89-IR-19*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*90-OI-19*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*91-IR-20*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*92-OI-20*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*93 - FINANCIAL SUSTAINABILITY RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart4 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		
		/*94 - Overview - img*/
		i++;
		tdpdf[i]=$('.uni-subinfo-overview img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*95 - Overview - text*/
		i++;
		tdpdf[i]=$('.overview').text();
		//tdpdf[i]=tdpdf[i].replace('/ • /g',' - ');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*96 - Mission - text*/
		i++;
		tdpdf[i]=$('.mission').text();
		//tdpdf[i]=tdpdf[i].replace('/ • /g',' - ');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*97 - Mission - img*/
		i++;
		tdpdf[i]=$('.uni-subinfo-img-box:gt(0) img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=tdpdf[i].replace('../','./');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*98 - Adres*/
		i++;
		tdpdf[i]=$('.uni-address-pp').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*99 - Country*/
		i++;
		tdpdf[i]=$('.uni-economy').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		
		$('#dtpdf').val(pfdstr);
		
	//	alert($('#dtpdf').val()+'\n'+tdpdf[97]);
	}
	function datatodoc()
	{
		var i=0;tdpdf=Array;var pfdstr='';
		/*0 - Наименование вуза*/
		tdpdf[i]=$('.uni-info-title').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*1 - Цвет лиги*/
		i++;
		tdpdf[i]=$('.cdttexp').css('color');
		tdpdf[i]=rgb_to_hex(tdpdf[i]).substr(1);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		//alert(rgb_to_hex(tdpdf[i]));
		/*2 - Логотип вуза*/
		i++;
		tdpdf[i]=$('.uni-logo img').attr('src');
		tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*3 - Флаг страны*/
		i++;
		tdpdf[i]=$('.uni-flag img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*4 - Ранг*/
		i++;
		if(Number($('#cntr :selected').val())>0)
		{tdpdf[i]=$('#texp_wr').val();}
		else{tdpdf[i]=$('#texp_wr').val();}
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*5 - Ранг по стране*/
		i++;
		if(Number($('#cntr :selected').val())>0)
		{tdpdf[i]=$('#texp_wr').val();}
		else{tdpdf[i]=$('#texp_cr').val();}
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*6 - Название лиги*/
		i++;
		tdpdf[i]=$('.uni-name').text();
		//tdpdf[i]=tdpdf[i].replace('Country rank','');
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*7 - Рисунок Лиги*/
		i++;
		tdpdf[i]=$('.uni-score img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*8 - Субъект*/
		i++;
		tdpdf[i]=$('#subj :selected').val();
		var sbbm={'SO':'RUR World University Ranking','SH':'RUR Humanities','SL':'RUR Life Sciences','SM':'RUR Medical Sciences','SN':'RUR Natural Sciences','SS':'RUR Social Sciences','SE':'RUR Technical Sciences'};
		pfdstr=pfdstr+sbbm[tdpdf[i]]+'|'; 
		/*9 - Год*/
		i++;
		tdpdf[i]=$('.points .active .point-text').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*10 - Foundation year:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:lt(1)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*11 -World University Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_WR td:gt(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*12 - -World University Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_WR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*13-Short name:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*14 -Teaching Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*15 -Teaching Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*16 - -Teaching Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_TR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*17-Type:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(6)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*18 -Research Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*19 -Research Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*20 - -Research Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_RR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*21-Students:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(8)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*22 -International Diversity Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*23 -International Diversity Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*24 - -International Diversity Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_IR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*25-Faculty:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(10)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*26 -Financial Sustainability Ranking - rank*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR td:nth-child(3)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*27 -Financial Sustainability Ranking - score*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR td:nth-child(4)').text();
		pfdstr=pfdstr+tdpdf[i]+'|';
		/*28 - -Financial Sustainability Ranking - img*/
		i++;
		tdpdf[i]=$('#tblrnk_O_FR img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*29-Faculty/Students Ratio:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(12)').text()+$('.uni-info-list dt:nth-child(13)').text()+$('.uni-info-list dt:nth-child(14)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*30-Web-site:*/
		i++;
		tdpdf[i]=$('.uni-info-list a').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*31-Web-site: Link*/
		i++;
		tdpdf[i]=$('.uni-info-list a').attr('href');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*32-Region:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:nth-child(18)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*33-Reputation Rankings - rank*/
		i++;
		tdpdf[i]=$('#reprnk').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*34-Reputation Rankings - score*/
		i++;
		tdpdf[i]=$('#repscr').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*35-Location:*/
		i++;
		tdpdf[i]=$('.uni-info-list dt:last').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*36-Academic Rankings - rank*/
		i++;
		tdpdf[i]=$('#resrnk').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*37-Academic Rankings - score*/
		i++;
		tdpdf[i]=$('#resscr').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*38-T-color*/
		i++;
		tdpdf[i]=$('.az-block-t div:first').css('background-color');
		tdpdf[i]=rgb_to_hex(tdpdf[i]).substr(1);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*39-IR-1*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*40-OI-1*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*41-T-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-t div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*42-T-League:*/
		i++;
		tdpdf[i]=$('.az-block-t div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*43-IR-2*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*44-OI-2*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*45-IR-3*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*46-OI-3*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*47-IR-4*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*48-OI-4*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*49-IR-5*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*50-OI-5*/
		i++;
		tdpdf[i]=$('.az-block-t .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*51 - TEACHING RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart1 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		
		/*52-R-color*/
		i++;
		tdpdf[i]=$('.az-block-r div:first').css('background-color');
		tdpdf[i]=rgb_to_hex(tdpdf[i]).substr(1);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*53-IR-6*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*54-OI-6*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*55-R-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-r div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*56-R-League:*/
		i++;
		tdpdf[i]=$('.az-block-r div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*57-IR-7*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*58-OI-7*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*59-IR-8*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*60-OI-8*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*61-IR-9*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*62-OI-9*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*63-IR-10*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*64-OI-10*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*65 - RESEARCH RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart2 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 

		/*66-I-color*/
		i++;
		tdpdf[i]=$('.az-block-i div:first').css('background-color');
		tdpdf[i]=rgb_to_hex(tdpdf[i]).substr(1);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*67-IR-11*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*68-OI-11*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(1) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*69-R-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-i div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*70-R-League:*/
		i++;
		tdpdf[i]=$('.az-block-i div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*71-IR-12*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*72-OI-12*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(2) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*73-IR-13*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*74-OI-13*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(3) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*75-IR-14*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*76-OI-14*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(4) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*77-IR-15*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*78-OI-15*/
		i++;
		tdpdf[i]=$('.az-block-i .uni-block-right tbody tr:nth-child(5) .td4').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*79 - NTERNATIONAL DIVERSITY RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart3 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 

		/*80-F-color*/
		i++;
		tdpdf[i]=$('.az-block-f div:first').css('background-color');
		tdpdf[i]=rgb_to_hex(tdpdf[i]).substr(1);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*81-IR-16*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(1) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*82-OI-16*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*83-F-Country Rank:*/
		i++;
		tdpdf[i]=$('.az-block-f div:first tr:nth-child(3) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*84-F-League:*/
		i++;
		tdpdf[i]=$('.az-block-f div:first tr:nth-child(5) td:nth-child(2)').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*85-IR-17*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(2) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*86-OI-17*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*87-IR-18*/
		i++;
		tdpdf[i]=$('.az-block-r .uni-block-right tbody tr:nth-child(3) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*88-OI-18*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 	
		/*89-IR-19*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(4) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*90-OI-19*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*91-IR-20*/
		i++;
		tdpdf[i]=$('.az-block-f .uni-block-right tbody tr:nth-child(5) .td3').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		/*92-OI-20*/
		i++;
		tdpdf[i]='-';
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*93 - FINANCIAL SUSTAINABILITY RANKING - PIE_chart - img*/
		i++;
		tdpdf[i]=$('#PIE_chart4 img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		
		/*94 - Overview - img*/
		i++;
		tdpdf[i]=$('.uni-subinfo-overview img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*95 - Overview - text*/
		i++;
		tdpdf[i]=$('.overview').text();
		//tdpdf[i]=tdpdf[i].replace('/ • /g',' - ');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*96 - Mission - text*/
		i++;
		tdpdf[i]=$('.mission').text();
		//tdpdf[i]=tdpdf[i].replace('/ • /g',' - ');
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*97 - Mission - img*/
		i++;
		tdpdf[i]=$('.uni-subinfo-img-box:gt(0) img').attr('src');
		if ( tdpdf[i].indexOf("?") > -1 ) {
			tdpdf[i]=tdpdf[i].substring(0, tdpdf[i].indexOf("?"));
		}		
		// tdpdf[i]=tdpdf[i].replace('png','jpg');
		tdpdf[i]=$.trim(tdpdf[i]);
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*98 - Adres*/
		i++;
		tdpdf[i]=$('.uni-address-pp').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 
		/*99 - Country*/
		i++;
		tdpdf[i]=$('.uni-economy').text();
		pfdstr=pfdstr+tdpdf[i]+'|'; 		
		
		$('#dtdoc').val(pfdstr);
		
		//alert($('#dtdoc').val()+'\n'+tdpdf[97]);
	}
	function insmodal()
	{
		var mdkd='<div class="svwnd"><form method="POST" action="../prophile_to_pdf.php" id="dttopdf"><input name="dtpdf" id="dtpdf" value="" type="hidden"><input type="submit" value="pdf" class="save_to_pdf form-control"/></form><form method="POST" action="../prophile_to_doc.php" id="dttodoc"><input name="dtdoc" id="dtdoc" value="" type="hidden"><input type="submit" value="doc"  class="save_to_doc form-control"/></form></div>';
		$('#vuzsel').append(mdkd);	
		// var btnsv='<div class="btnsave col-md-12 ptb1"><input class="savrepr" id="savr" type="submit" value="Save"/></div>';
		// $('.btnrepr').after(btnsv);
		$('.svwnd').css('display','none');
		
	}
	function hexToRgb(hex)
	{
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) 
		{
			return r + r + g + g + b + b;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ?
		{
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
		//var rgbObj = hexToRgb('#f00'); // red
		//alert('rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'); // rgb(255,0,0)
	function rgb_to_hex(color){
		var rgb = color.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : color;
	}
    function make_loc()
	{
     	var dmrnk=$('#dimrank').val();
      	var sbsl=$('#subj').val();
     	var yrsl= $('#years option:selected').text();
      	var aliasesl=$('#pglnk').html();
      	var unnmsl=window.location.pathname;
      	
      if(aliasesl!='')
        {unnmsl=/universities/+aliasesl+'.html';}
      
      
      var jnmun= $.trim($('.page-header h1').html());
      
      if(jnmun=='National Yang Ming Chiao Tung University'||jnmun=='National Yang Ming Univeristy')  
      {
      	if(jnmun=='National Yang Ming Chiao Tung University')
      	{
      		if(Number(yrsl)<2022)
      		{
				$('#search-university').html('<a href="./universities/national-yang-ming-university.html?sort='+dmrnk+'&year='+yrsl+'&subject='+sbsl+'" target="_parent" style="color: #5C5E5B">Show</a>');
			}
			else
			{
				$('#search-university').html('<a href="./universities/national-yang-ming-chiao-tung-university.html?sort='+dmrnk+'&year='+yrsl+'&subject='+sbsl+'" target="_parent" style="color: #5C5E5B">Show</a>');
				//alert($('#search-university').html());
			}
      	}
      	else
      	{
			if(Number(yrsl)<2022)
      		{
				$('#search-university').html('<a href="./universities/national-yang-ming-university.html?sort='+dmrnk+'&year='+yrsl+'&subject='+sbsl+'" target="_parent" style="color: #5C5E5B">Show</a>');
			}
			else
			{
				$('#search-university').html('<a href="./universities/national-yang-ming-chiao-tung-university.html?sort='+dmrnk+'&year='+yrsl+'&subject='+sbsl+'" target="_parent" style="color: #5C5E5B">Show</a>');
				//alert($('#search-university').html());
			}
		}
      	
      }
      else
      {
	  	$('#search-university').html('<a href="'+unnmsl+'?sort='+dmrnk+'&year='+yrsl+'&subject='+sbsl+'" target="_parent" style="color: #5C5E5B">Show</a>');
	  }
      
     //alert(window.location.host+window.location.pathname+ '\n'+dmrnk+' '+sbsl+' '+yrsl);
     // alert($('#search-university a').attr('href'));
    }
	});
	})(jQuery);
/* Работа с профайлом */
	(function (az, doc, win) {
		doc.ready(function () {
			az(".az-mail-link").attr("href", "maito:/" + "/info@roundranking.com");

		});
	})(jQuery, jQuery(document), jQuery(window));
}
catch (e) {}
jQuery(function () {
	jQuery('[data-toggle="tooltip"]').tooltip()
})
