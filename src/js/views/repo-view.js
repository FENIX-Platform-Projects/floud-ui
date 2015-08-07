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

	var	publicationTmpl = Handlebars.compile(detail);
	function getWDS(queryTmpl, queryVars, callback) {

			var sqltmpl, sql;

			if(queryVars) {
				
				sqltmpl = _.template(queryTmpl);
				sql = sqltmpl(queryVars);
			}
			else{

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
	
	
	
	
	function getData(sql){getWDS(sql, null, function(json)	{
			$('#listPubs').empty();
				
				

			var idPub = 0;

			var categoy={	"1":"FRA results",
							"2"	:"Guidelines & definitions",
							"3"	:"FRA methods & manuals",
							"4"	:"Planning documents",
							"5"	:"FRA evaluations",
							"6"	:"Technical document",
							"7"	:"Maps"
						};
			
			_.each(json, function(pub2) {

				var pub = {
					"PublicationId": idPub++,
					"Category":categoy[pub2[0]],
					"PublicationName": pub2[1],
					"PublicationDescription": pub2[2],
					"PublicationSource": pub2[5],
					"PublicationAuthorName": pub2[6],
					"PublicationSector&Theme": pub2[7],
					"PublicationDate":pub2[4],
					"DocumentLanguage":pub2[8],
					"REC":pub2[9],
					"Countries":pub2[10],
					"DocumentTags":pub2[15],
					"PublicationRating":pub2[16],
					"PublicationComments":"",
					"DocumentType":pub2[11],
					"DocumentSource":pub2[13]
				};

				pub.DocumentTags = pub.DocumentTags ? pub.DocumentTags.split(', ') : '';
				pub.Category = pub.Category ? pub.Category.split('|') : '';
				pub.DocumentType = pub.DocumentType.replace('.','');

				$('#listPubs').append( publicationTmpl(pub) );

			});		
		});
		}
	
    var RepoView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'modules',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
				getData(Config.queries.pubs_reformat);
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat;
  return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'repo'});
					
					

					$("#txtSearch").on("input" ,function(){
		$(".afo-category-list-li").removeClass("active");
		$(".afo-category-list-li").addClass("noactive");
		getData(Config.queries.pubs_reformat+" where upper(description) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(title) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(author_name) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(source) like '%"+this.value.toUpperCase().split(" ").join("%")+"%'");
		
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat+" where upper(description) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(title) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(author_name) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' or upper(source) like '%"+this.value.toUpperCase().split(" ").join("%")+"%' "
		});
		
		
		/*getWDS("select * from publications",null,function(data)	{
		console.log(data);
		});*/
		
		
		$(".afo-category-list-li").click(function(){
		$(".afo-category-list-li").removeClass("active");
		$(".afo-category-list-li").addClass("noactive");
		//console.log(this.innerHTML)
		document.getElementById("txtSearch").value="";
		var tempCategory = $(this).attr('cat');
		if(tempCategory=="All")
		{
			getData(Config.queries.pubs_reformat);
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat;
		
			
		}
		else{
		getData(Config.queries.pubs_reformat+" where category = '"+tempCategory+"' ");
		Config.queries.pubs_reformat2=Config.queries.pubs_reformat+" where category = '"+tempCategory+"' ";
		}
		//console.log(Config.queries.pubs_reformat+" where upper(category) like '%"+this.innerHTML.toUpperCase()+"%' ")
		this.className="afo-category-list-li active";
		});
		
		$("#mostRecentOreder").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by posting_date DESC");
		
		});
		
		$("#alphabeticOrder").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by title");
		
		});
		$("#alphabeticOrderInv").click(function(){
		
		getData(Config.queries.pubs_reformat2 +"  order by title DESC");
		
		});	
		
	

        }
    });

    return RepoView;
});
