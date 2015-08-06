/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/repo/repo.hbs',
    'i18n!nls/repo',
    'config/Events',
    'amplify',
	
	
	'text!templates/repo/repo_detail.hbs',
	'config/event_category',
	'config/services',
	'handlebars'
], function (View,
 template,
 i18nLabels, 
 E,
 amplify,
 detail,
 	matchingCategory,
 Config,
 Handlebars
 ) {

    'use strict';

	var	eventsTmpl = Handlebars.compile(detail);
	function getWDS(queryTmpl, queryVars, callback) {

			var sqltmpl, sql;

			if(queryVars) {
				console.log('un');
				sqltmpl = _.template(queryTmpl);
				sql = sqltmpl(queryVars);
			}
			else{

				console.log('deux',queryTmpl);
			sql = queryTmpl;
			}
			var	data = {
					datasource: Config.dbName,
					thousandSeparator: ',',
					decimalSeparator: '.',
					decimalNumbers: 2,
					cssFilename: '',
					nowrap: false,
					valuesIndex: 0,
					json: JSON.stringify({query: sql})
				};
			$.ajax({
				url: Config.wdsUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: callback
			});
		}


	


	//$.getJSON('data/publications.json', function(json) {	
	
	function getData(sql){
		var test=2;
		getWDS(sql, null, function(json)	{
			
		$('#listPubs').empty();
			
		//	console.log('listPubs',json);

		var idPub = 0;
 
		_.each(json, function(pub2) {

			var eve = {
				"eventInternalId": idPub++,
				"id": pub2[0],
				"category": pub2[1],
				"date_start": pub2[2],
				"date_end": pub2[3],
				"description": pub2[4],
				"title": pub2[5],
				"venue": pub2[13],
				"country": pub2[14]
			};
			//,"long_description": pub2[6]

			if(pub2[4]==pub2[6]){console.log("no long");}
			else{eve["long_description"]=pub2[6];}
			
			var nbDoc=pub2[7];
			var attachments={L:[],PR:[],D:[],PI:[]};
			
			
			var EA_type=pub2[8].split('@|');
			var EA_file_name=pub2[9].split('@|');
			var EA_attachment_title=pub2[10].split('@|');
			var EA_attachment_size=pub2[11].split('@|');
			var EA_attachment_description=pub2[12].split('@|');
			for (var nd=0;nd<nbDoc;nd++)
			{
				
				attachments[EA_type[nd]].push(
			{
				"type":EA_type[nd],
				"file_name":Config["url_attachment_"+EA_type[nd]]+EA_file_name[nd],
				"attachment_title":EA_attachment_title[nd],
				"attachment_size":EA_attachment_size[nd],
				"attachment_description":EA_attachment_description[nd],
			});}
			eve.attachments=attachments;
			
		/*	pub.DocumentTags = pub.DocumentTags ? pub.DocumentTags.split(', ') : '';*/
			eve.category = eve.category ? eve.category.split('|') : '';
			for(var cat in eve.category){
				eve.category[cat]=matchingCategory[eve.category[cat]];
				}
	/*		pub.DocumentType = pub.DocumentType.replace('.','');
*/
			$('#listPubs').append( eventsTmpl(eve) );
			//alert('ok');
			//$('#content_'+eve.id).html(eve.description);

		});		
	});}
	
	
	
	
    var RepoView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'modules',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
			
			
		
	
			
			getData(Config.queries.events_reformat);
			Config.queries.events_reformat2=Config.queries.events_reformat;

			
			
			
			
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'repo'});
				
$("#txtSearch").on("input" ,function(){
	console.log('txtSearch');
	$(".afo-category-list-li").removeClass("active");
	$(".afo-category-list-li").addClass("noactive");
	getData(Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%'");
	
	Config.queries.events_reformat2=Config.queries.events_reformat+" where description ilike '%"+this.value.split(" ").join("%")+"%' or title ilike '%"+this.value.split(" ").join("%")+"%' "
	});
	
	
	/*getWDS("select * from publications",null,function(data)	{
	console.log(data);
	});*/
	
	
	$(".afo-category-list-li").click(function(){
		console.log('.afo-category-list-li');
	$(".afo-category-list-li").removeClass("active");
	$(".afo-category-list-li").addClass("noactive");
	//console.log(this.innerHTML)
	document.getElementById("txtSearch").value="";
	var tempCategory = $(this).attr('cat');
	console.log('tempCategory',tempCategory)
	if(tempCategory=="All")
	{
		getData(Config.queries.events_reformat);
		Config.queries.events_reformat2=Config.queries.events_reformat;
	}
	else{
		
	getData(Config.queries.events_reformat+" where category = '"+tempCategory+"'");
	Config.queries.events_reformat2=Config.queries.events_reformat+" where category = '"+tempCategory+"' ";
	}
	//console.log(Config.queries.events_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ")
	this.className="afo-category-list-li active";
	});
	
	$("#mostRecentOreder").click(function(){
		console.log('.afo-category-list-li');
		getData(Config.queries.events_reformat2 +"  order by date_start DESC");
	
	});
	
	$("#alphabeticOrder").click(function(){
	
	getData(Config.queries.events_reformat2 +"  order by title");
	
	});
	$("#alphabeticOrderInv").click(function(){
		getData(Config.queries.events_reformat2 +"  order by title DESC");	});	
	
	

        }
    });

    return RepoView;
});
