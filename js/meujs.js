$(document).ready(function(){

    
    //include autocomplete in the search field
    lexiconModule.includeAutoComplete();

    //include cloud of symbols in the main page
    lexiconModule.createLexiconCloud();



});


// get the word searched 
function Searching(){
    
    if (searchText !="") {
        lexiconModule.searchByLexiconSymbol(searchText,false);
        /*parseXmlBusca(termo_pesquisa,false);*/
    } 
    
}

// clean the references in memory and load the symbol referenced
function reloadingPage(){
    
    $(".ref_simbolo" ).unbind( "click" );   
    $(".ref_simbolo").click(function(){
       
        parseXmlBusca($(this).data("id-simb-ref"), true);


    });
}
    

// control the status of a request
function meuAjax(type, url, dataType){

    return $.ajax({

        type: type,
        
        url: url,     
        
        dataType: dataType,
        
        error: function (xhr, status) {
              switch (status) {
                 case 404:
                     alert('File not found');
                     break;
                 case 500:
                     alert('Server error');
                     break;
                 case 0:
                     alert('Request aborted');
                     break;
                 default:
                     alert('Unknown error ' + status);
             } 
         }

    });
}    



/*###################################################################################################
   lexicon module
####################################################################################################*/


var lexiconModule = {
 
    searchByLexiconSymbol: function(searchTerm, byId){

    /* make the ajax request */
    var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

    promise.success(function (xml) {
        
        $(xml).find("lexico").each(function(){

            var stringToCompare ="";

            if (byId){
                    stringToCompare = $(this).find("nome_simbolo").attr("id");
            }else{
                    stringToCompare = $(this).find("nome_simbolo").find("texto").text();
            }
            
            var symbolId = $(this).find("nome_simbolo").attr("id");
            var symvolName = $(this).find("nome_simbolo").find("texto").text();
            var symbolNotion = "";
            var symbolImpact = "";
            var symbolSynonyms = "";
            var objSymbolFound = {symbolId: "", symbolName:"", symbolNotion:"", symbolImpact:"", symbolSynonyms:""};

            //compare the searched symbol with the ones in the lexicon, all in lower case
            if($.trim(searchTerm.toLowerCase()) == $.trim(stringToCompare.toLowerCase())) {


                // assembles synonyms text
                $(this).find("sinonimos").find("sinonimo").each(function(){

                   // Don't put comma before first synonym 
                   if ($(this).is(':first-child')){
                          
                        symbolSynonyms = symbolSynonyms + $(this).text();      

                   } else{

                        symbolSynonyms = symbolSynonyms +", "+ $(this).text(); 
                   }

                });

                // include a dash if there are no synonyms or sentence end point.
                if ($.trim(symbolSynonyms) == "") {

                    symbolSynonyms = " - ";

                } else{

                    symbolSynonyms = symbolSynonyms + ".";

                }


                //assembles notion text: content+hypertext+content
                $(this).find("nocao").find("texto").each(function(){

                                             
                    // verify references to other symbols in notion text    
                    if ($(this).is('[referencia_lexico]')) {

                        var referencedSymbolId = $(this).attr("referencia_lexico");

                        symbolNotion = symbolNotion + "<a data-id-simb-ref='"+referencedSymbolId
			+"' class='ref_simbolo' href='#'>" + " " + $(this).text() + "</a>" + " ";
                    
                    }else{
                        symbolNotion = symbolNotion + " " + $(this).text() + " ";
                    }

                });


                 //assembles impact text: content+hypertext+content
                $(this).find("impacto").find("texto").each(function(){

                     // verify references to other symbols in impact text  
                     if ($(this).is('[referencia_lexico]')) {

                        var referencedSymbolId = $(this).attr("referencia_lexico");

                        symbolImpact = symbolImpact + "<a data-id-simb-ref='"+referencedSymbolId+"' class='ref_simbolo' href ='#'>"
			+" "+$(this).text()+"</a>"+ " ";

                     }else{

                        symbolImpact = symbolImpact + " " + $(this).text() + " ";  

                     }

                });

         	// the object wich stores the symbol founded is filled with content 
                objSymbolFound.symbolId = symbolId;
                objSymbolFound.symbolName = symvolName;
                objSymbolFound.symbolNotion = symbolNotion;
                objSymbolFound.symbolImpact= symbolImpact;
                objSymbolFound.symbolSynonyms = symbolSynonyms;

               // alert("inside :>"+objSymbolFound.symbolNotion)

                // change the 2nd 3rd 4rd quadrant of contents
                lexiconModule.changeOthersSymbols();

                // exposes the object with the symbol found
                lexiconModule.changeMainSymbol(objSymbolFound);
                
            }
        });
    });
    
},

//exposes the symbol that was recently searched and founded in the lexicon
changeMainSymbol: function (objSymbol){
        
    $("#nm_simb1").html(objSymbol.symbolName);

    obj_simbolo.nocao = replaceAll(objSymbol.symbolNotion, "\n", "<br />");
    $("#noc_simb1").html(obj_simbolo.nocao);

    obj_simbolo.impacto = replaceAll(objSymbol.symbolImpact, "\n", "<br />");
    $("#imp_simb1").html(objSymbol.impacto);

    //$("#class_simb1").html(obj_simbolo.classificacao);

    $("#sin_simb1").html(objSymbol.symbolSynonyms);

    // referencias simbolo principal

    //verificarSimbolosQueReferenciam(obj_simbolo.id_simb, false);
   
},

//make the movements of symbols through the quadrants, so the first quadrant is cleared.
changeOthersSymbols: function (){

    //symbol 3 -> symbol 4, symbol 2 -> symbol 3 e symbol 1 -> symbol 2 
    for (var i = 4; i >= 1; i--) {
        $("#nm_simb" + i).html($("#nm_simb" + (i-1)).html());
        $("#noc_simb" + i).html($("#noc_simb" + (i-1)).html());
        $("#imp_simb" + i).html($("#imp_simb" + (i-1)).html());
        $("#sin_simb" + i).html($("#sin_simb" + (i-1)).html());
        $("#class_simb" + i).html($("#class_simb" + (i-1)).html());
        $("#ref_simb" + i).html($("#ref_simb" + (i-1)).html());
    };

},

   
//using the ajax request
//returns the set of symbols referenced by the symbol searched
returnSymbolsThatReference: function (symbolId) {
    
    
    var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

    var symbolsThatReference = [];

    promise.success(function (xml) {

        $(xml).find("lexico").each(function(){

            var currentSymbolId = $(this).find("nome_simbolo").attr("id");

            var currentSymbolName = $(this).find("nome_simbolo").find("texto").text();

            var currentSymbolWasFound = false;

            // Verify in the notion section 
            $(this).find("nocao").find("texto").each(function(){

                // Verify if the notion text has reference to the symbol 
                if ($(this).is('[referencia_lexico]')) {

                    var referencedSymbolId = $(this).attr("referencia_lexico");

                    if (referencedSymbolId == symbolId){
                        
                        var currentSymbol = {symbolId:currentSymbolId, symbolName:currentSymbolName};

                        symbolsThatReference.push(currentSymbol);

                        currentSymbolWasFound = true;

                        return false;

                    }
                
                }

            });

            if (!currentSymbolWasFound){

                // Verify in the impact section
                $(this).find("impacto").find("texto").each(function(){

		   // Verify if the impact text has reference to the symbol 
                    if ($(this).is('[referencia_lexico]')) {

                        var referencedSymbolId = $(this).attr("referencia_lexico");

                        if (referencedSymbolId == symbolId){
                            
                            var currentSymbol = {symbolId:currentSymbolId, symbolName:currentSymbolName};

                            symbolsThatReference.push(currentSymbol);

                            return false;

                        }
                    
                    }
                    

                });   

            }

            return symbolsThatReference;
                
        });

    });

},

/*
    title: display symbols references
    goal: 
    context:
    actors:
    resources:
    episodes:
    exception:
*/ 

    displaySymbolReferences: function (symbolsThatReference){

        if (symbolsThatReference.length == 0){

            $("#ref_simb1").html(" - ");

        }else{

            var referencesText = "";
            for (var i = 0; i < symbolsThatReference.length; i++) {
                
                if (i == 0){
                    referencesText = referencesText + "<a data-id-simb-ref='"+symbolsThatReference[i].symbolId
		    +"' class='ref_simbolo' href ='#' >"+" "+symbolsThatReference[i].symbolName+"</a>";
                }else{
                    referencesText = referencesText + ", <a data-id-simb-ref='"+symbolsThatReference[i].symbolId
		    +"' class='ref_simbolo' href ='#' >"+" "+symbolsThatReference[i].symbolName+"</a>";
                }
               
            }

            referencesText = referencesText + ".";

            $("#ref_simb1").html(referencesText);
        }
 

            // to update the symbols referenced to become hyperlinks.
            reloadingPage();

    },
 
/*
    title: include autocomplete in search field
    goal: allow the autocomplete in the search field, providing the name of all symbols to the component.
    context:
    actors:
    resources:
    episodes:
    exception:
*/  

    // alows to the search box to load the existing symbols gived a word
    includeAutoComplete: function () {


        var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

        var allSymbolsName = [];

        promise.success(function (xml) {

            //#episode: push all symbols name into the array
            $(xml).find("lexico").each(function(){

                allSymbolsName.push($(this).find("nome_simbolo").find("texto").text());

            });
            
            // #episode: restric the research in the research field by the first letters of the word
            $("#searchText").autocomplete({
                source: function(req, responseFn) {
                    var re = $.ui.autocomplete.escapeRegex(req.term);
                    var matcher = new RegExp( "^" + re, "i" );
                    var a = $.grep(allSymbolsName, function(item,index){
                        return matcher.test(item);
                    });
                    responseFn( a );
                },
                // trigger the symbol selection when the user selects a symbol from autocomplete list
                select: function (event, ui){

                    var searchText = ui.item.value;
                    lexiconModule.searchByLexiconSymbol(searchText,false);
/*                    parseXmlBusca(searchText, false);*/
                }
            });


         });   


    },

/*
    title: create a cloud of lexicon symbols
    goal: allow the visualization of all lexicon symbols in the format of a cloud
    context:
    actors:
    resources:
    episodes:
    exception:
*/ 

    //build the cloud of symbols in the lexicon
    createLexiconCloud: function () {

        // make the ajax request
        var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

        var amoutOfReferencesOfEachSymbol = [];

        promise.success(function (xml) {

            // stores the name, id and amout of references of all lexicon symbos in an array.
            $(xml).find("lexico").each(function(){

                var currentSymbolName = $(this).find("nome_simbolo").find("texto").text()
                
                var currentSymbolId = $(this).find("nome_simbolo").attr("id");

                /*var amoutOfSymbolReferences = verificarSimbolosQueReferenciam(id_simb_atual, true);*/
                var amoutOfSymbolReferences = returnSymbolsThatReference(currentSymbolId);

                var currentSymbol = {symbolName:currentSymbolName, symbolId:currentSymbolId, 		 	
		symbolAmoutOfReferences:amoutOfSymbolReferences};

                amoutOfReferencesOfEachSymbol.push(currentSymbol);

            });


            // depending on the amout of references of a lexicon symbol, set its css class.
            for (var i = 0; i < amoutOfReferencesOfEachSymbol.length; i++) {

                var amountOfReferences = amoutOfReferencesOfEachSymbol[i].qtd_ref;

                alert(amountOfReferences);

                var symbolCSSClass = "";
                
                if (amountOfReferences <= 7){

                    symbolCSSClass = "weight-1"; 

                }else if(amountOfReferences <= 14){

                    symbolCSSClass = "weight-2";

                }else if(amountOfReferences <= 21){

                    symbolCSSClass = "weight-3";

                }else if(amountOfReferences <= 28){

                    symbolCSSClass = "weight-4"; 

                }else {

                    symbolCSSClass = "weight-5";

                }

                // prepares the lexicon symbols to be shown in the html-cloud
                $("#tag_cloud").append(" <a data-id-simb-ref='"+amoutOfReferencesOfEachSymbol[i].symbolId
		+"' class='ref_simbolo' href ='#' ><span class='"+symbolCSSClass+"'>"
		+amoutOfReferencesOfEachSymbol[i].currentSymbolName+"</span></a>");

            }

                               
        });  

    },
 
    // override the current configuration
    updateMyConfig: function() {
 
        
    }

};

/*#########################################################################################################
          ajax module
##########################################################################################################*/

var ajaxModule = {
 
/*
    title: make ajax request
    goal: enables making ajax requests informing the type, url and dataType
    context:
    actors:
    resources:
    episodes:
    exception:
*/ 

    ajaxRequest: function(type, url, dataType) {
 
       return $.ajax({

            type: type,
            
            url: url,     
            
            dataType: dataType,
            
            error: function (xhr, status) {
                  switch (status) {
                     case 404:
                         alert('File not found');
                         break;
                     case 500:
                         alert('Server error');
                         break;
                     case 0:
                         alert('Request aborted');
                         break;
                     default:
                         alert('Unknown error ' + status);
                 } 
             }

        });
    }

};
 

