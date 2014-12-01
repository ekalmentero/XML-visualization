$(document).ready(function(){

    
    //INCLUDE AUTOCOMPLETE IN SEARCH FIELD
    lexiconModule.includeAutoComplete();

    verificarSimbolosQueReferenciam2();


     
  /*temporalmente desactivated*/ 
/*
    $("#btn_pesquisar").click(function(){
        
        var termo_pesquisa = $("#termo_pesquisa").val()

        if (termo_pesquisa != ""){
         
            parseXmlBusca(termo_pesquisa, false);
        
        }
       
    });
*/
    $("#todos").click(function(){

       // $("#conteudo").empty();  
       // meuAjax(parseXml, "xml/lexico.xml", "xml");
        
    });


   // $(function(){
  //      aoCarregarPagina();
   // });

});


function Searching(){
    // body...
    if (termo_pesquisa !="") {
        parseXmlBusca(termo_pesquisa,false);
    } 
    //alert(termo_pesquisa);
}


function aoCarregarPagina(){
    
    $(".ref_simbolo" ).unbind( "click" );   
    $(".ref_simbolo").click(function(){
        //alert("teste");
        //alert($(this).data("id-simb-ref"));
        parseXmlBusca($(this).data("id-simb-ref"), true);


    });
}
    

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

function parseXmlBusca(termo_pesquisa, porId){


    var promise = meuAjax("GET", "xml/lexico.xml", "xml");

    promise.success(function (xml) {
        
        $(xml).find("lexico").each(function(){

            var texto_comparacao ="";

            if (porId){
                    texto_comparacao = $(this).find("nome_simbolo").attr("id");
            }else{
                    texto_comparacao = $(this).find("nome_simbolo").find("texto").text();
            }
            
            var id_simb = $(this).find("nome_simbolo").attr("id");
            var nome = $(this).find("nome_simbolo").find("texto").text();
            var nocao = "";
            var impacto = "";
            var nome_sinonimos = "";

            //alert("comparando : "+$.trim(termo_pesquisa.toLowerCase())+" ----- com :"+$.trim(texto_comparacao.toLowerCase()));

            if($.trim(termo_pesquisa.toLowerCase()) == $.trim(texto_comparacao.toLowerCase())) {


                // organiza exibição de sinônimos
                $(this).find("sinonimos").find("sinonimo").each(function(){

                   // se for o primeiro sinônimo, não coloca virgula antes de seu nome.
                   if ($(this).is(':first-child')){
                          
                        nome_sinonimos = nome_sinonimos + $(this).text();      

                   } else{

                        nome_sinonimos = nome_sinonimos +", "+ $(this).text(); 
                   }

                });


                //Organiza texto de noção
                $(this).find("nocao").find("texto").each(function(){

            
                                   
                    // Verifica se a palavra referencia outro símbolo do léxico.      
                    if ($(this).is('[referencia_lexico]')) {

                        var id_referencia = $(this).attr("referencia_lexico");

                        nocao = nocao + "<a data-id-simb-ref='"+id_referencia+"' class='ref_simbolo' href='#'>" + " " + $(this).text() + "</a>" + " ";
                    
                    }else{
                        nocao = nocao + " " + $(this).text() + " ";
                    }

                });


                 //Organiza texto do impacto 
                $(this).find("impacto").find("texto").each(function(){

                     if ($(this).is('[referencia_lexico]')) {

                        var id_referencia = $(this).attr("referencia_lexico");

                        impacto = impacto + "<a data-id-simb-ref='"+id_referencia+"' class='ref_simbolo' href ='#' >"+" "+$(this).text()+"</a>"+ " ";

                    }else{

                        impacto = impacto + " " + $(this).text() + " ";  

                    }

                });

               
                // exibe traço se não houve sinônimos ou insere um ponto final na lista.
                if ($.trim(nome_sinonimos) == "") {
                    nome_sinonimos = " - ";
                } else{
                    nome_sinonimos = nome_sinonimos + ".";
                }

                // inicializa objeto que irá armazenar dados do simbolo
                var obj_simbolo = {id_simb: "", nome:"", nocao:"", impacto:"", classificacao:"", sinonimos:""};

                obj_simbolo.id_simb = id_simb;
                obj_simbolo.nome = nome;
                obj_simbolo.nocao = nocao;
                obj_simbolo.impacto= impacto;
                obj_simbolo.classificacao = " - ";
                obj_simbolo.sinonimos = nome_sinonimos;

                organizarSimbolosTela();

                alterarSimboloPrincipal(obj_simbolo);
                
                return false;
                

            }
        });
    });

    
}
    

function alterarSimboloPrincipal(obj_simbolo){
        
    $("#nm_simb1").html(obj_simbolo.nome);

    obj_simbolo.nocao = replaceAll(obj_simbolo.nocao, "\n", "<br />");
    $("#noc_simb1").html(obj_simbolo.nocao);

    obj_simbolo.impacto = replaceAll(obj_simbolo.impacto, "\n", "<br />");
    $("#imp_simb1").html(obj_simbolo.impacto);

    $("#class_simb1").html(obj_simbolo.classificacao);

    $("#sin_simb1").html(obj_simbolo.sinonimos);

    // referencias simbolo principal

    verificarSimbolosQueReferenciam(obj_simbolo.id_simb, false);


   
}

    
function organizarSimbolosTela(){

    //simbolo 3 -> simbolo 4, simbolo 2 -> simbolo 3 e simbolo 1 -> simbolo 2 
    for (var i = 4; i >= 1; i--) {
        $("#nm_simb" + i).html($("#nm_simb" + (i-1)).html());
        $("#noc_simb" + i).html($("#noc_simb" + (i-1)).html());
        $("#imp_simb" + i).html($("#imp_simb" + (i-1)).html());
        $("#sin_simb" + i).html($("#sin_simb" + (i-1)).html());
        $("#class_simb" + i).html($("#class_simb" + (i-1)).html());
        $("#ref_simb" + i).html($("#ref_simb" + (i-1)).html());
    };

}

function exibirNuvemTags(qtd_ref_simbolos){

    var word_array = [];
      /*    {text: "Lorem", weight: 15},
          {text: "Ipsum", weight: 9, link: "http://jquery.com/"},
          {text: "Dolor", weight: 6, html: {title: "I can haz any html attribute"}},
          {text: "Sit", weight: 7},
          {text: "Amet", weight: 5}
      
      ];*/

    for (var i = 0; i < qtd_ref_simbolos.length; i++) {
        word_array[i] = [];
        word_array[i].text = qtd_ref_simbolos[i].nome_simbolo;
        word_array[i].weight = qtd_ref_simbolos[i].qtd_ref;
        word_array[i].link = "http://jquery.com/";
    };

       
    $("#nuvemTags").jQCloud(word_array);
}

    

function replaceAll(string, token, newtoken) {
    while (string.indexOf(token) != -1) {
        string = string.replace(token, newtoken);
    }
    return string;
}


function verificarSimbolosQueReferenciam(id_simbolo, ehContagem){

    var promise = meuAjax("GET", "xml/lexico.xml", "xml");

    var simb_que_referenciam = [];

    promise.success(function (xml) {

        $(xml).find("lexico").each(function(){

            var id_simb_atual = $(this).find("nome_simbolo").attr("id");

            var nome_simb_atual = $(this).find("nome_simbolo").find("texto").text();

            var simb_atual_encontrado = false;

            // Verifica noção
            $(this).find("nocao").find("texto").each(function(){

                // Verifica se o texto da noção possui referência ao id passado por parâmetro
                if ($(this).is('[referencia_lexico]')) {

                    var id_referencia = $(this).attr("referencia_lexico");

                    if (id_referencia == id_simbolo){
                        
                        var simb_atual = {id_simb:id_simb_atual, nome:nome_simb_atual };

                        simb_que_referenciam.push(simb_atual);

                        simb_atual_encontrado = true;

                        return false;

                    }
                
                }

            });

            if (!simb_atual_encontrado){

                 //Verifica impacto
                $(this).find("impacto").find("texto").each(function(){

                    if ($(this).is('[referencia_lexico]')) {

                        var id_referencia = $(this).attr("referencia_lexico");

                        if (id_referencia == id_simbolo){
                            
                            var simb_atual = {id_simb:id_simb_atual, nome:nome_simb_atual };

                            simb_que_referenciam.push(simb_atual);

                            return false;

                        }
                    
                    }
                    

                });   

            }
                
        });

        if (!ehContagem){

            if (simb_que_referenciam.length == 0){

                $("#ref_simb1").html(" - ");

            }else{

                var textoRef = "";
                for (var i = 0; i < simb_que_referenciam.length; i++) {
                    
                    if (i == 0){
                        textoRef = textoRef + "<a data-id-simb-ref='"+simb_que_referenciam[i].id_simb+"' class='ref_simbolo' href ='#' >"+" "+simb_que_referenciam[i].nome+"</a>";
                    }else{
                        textoRef = textoRef + ", <a data-id-simb-ref='"+simb_que_referenciam[i].id_simb+"' class='ref_simbolo' href ='#' >"+" "+simb_que_referenciam[i].nome+"</a>";
                    }
                   
                }
                textoRef = textoRef + ".";
                $("#ref_simb1").html(textoRef);
            }

            // para que os links dos simbolos que referenciam funcionem.
            aoCarregarPagina();

        }else{
        
            alert("retorando valor: "+simb_que_referenciam.length);
            return simb_que_referenciam.length;
        
        }   
    });

   // return 0;

 } 


function verificaSeExiste(termo, lista){

    for (var i = 0; i < lista.length; i++) {

        if($.trim(lista[i].id).toLowerCase() == $.trim(termo.id).toLowerCase()){
            return true;
        }
    }

    return false;
 }


function montaListaIdSimbolos(){

    var promise = meuAjax("GET", "xml/lexico.xml", "xml");

    var id_todos_simb = [];

    promise.success(function (xml) {


        $(xml).find("lexico").each(function(){

            id_todos_simb.push($(this).find("nome_simbolo").attr("id"));

        });
        
        return id_todos_simb;

     });   

}






function verificarSimbolosQueReferenciam2(){

    
    var promise = meuAjax("GET", "xml/lexico.xml", "xml");

    var simb_que_referenciam = [];

    var qtd_ref_simb = [];

    promise.success(function (xml) {

         $(xml).find("lexico").each(function(){

            var nome_simb_atual = $(this).find("nome_simbolo").find("texto").text()
            
            var id_simb_atual = $(this).find("nome_simbolo").attr("id");

            var simb_atual = {nome_simbolo:nome_simb_atual, id_simb:id_simb_atual, qtd_ref:0};

            qtd_ref_simb.push(simb_atual);

        });

        for (var i = 0; i < qtd_ref_simb.length; i++) {

                   
            $(xml).find("lexico").each(function(){

                var id_simb_atual = $(this).find("nome_simbolo").attr("id");

                var nome_simb_atual = $(this).find("nome_simbolo").find("texto").text();

                var simb_atual_encontrado = false;

                // Verifica noção
                $(this).find("nocao").find("texto").each(function(){

                    // Verifica se o texto da noção possui referência ao id passado por parâmetro
                    if ($(this).is('[referencia_lexico]')) {

                        var id_referencia = $(this).attr("referencia_lexico");

                        if (id_referencia == qtd_ref_simb[i].id_simb){
                            
                            qtd_ref_simb[i].qtd_ref =  qtd_ref_simb[i].qtd_ref + 1;

                            return false;

                        }
                    
                    }

                });

                if (!simb_atual_encontrado){

                     //Verifica impacto
                    $(this).find("impacto").find("texto").each(function(){

                        if ($(this).is('[referencia_lexico]')) {

                            var id_referencia = $(this).attr("referencia_lexico");

                            if (id_referencia == qtd_ref_simb[i].id_simb){
                            
                                qtd_ref_simb[i].qtd_ref = qtd_ref_simb[i].qtd_ref + 1;

                                return false;

                            }
                        
                        }
                        

                    });   

                }
                    
            });

            //alert("retorando valor: "+qtd_ref_simb[i].qtd_ref);
        };

        for (var i = 0; i < qtd_ref_simb.length; i++) {

            var qtd = qtd_ref_simb[i].qtd_ref;

            //alert(qtd);

            var class_simb = "";
            
            if (qtd <= 7){

                class_simb = "weight-1"; 

            }else if(qtd <= 14){

                class_simb = "weight-2";

            }else if(qtd <= 21){

                class_simb = "weight-3";

            }else if(qtd <= 28){

                class_simb = "weight-4"; 

            }else {

                class_simb = "weight-5";

            }

            $("#tag_cloud").append(" <a data-id-simb-ref='"+qtd_ref_simb[i].id_simb+"' class='ref_simbolo' href ='#' ><span class='"+class_simb+"'>"+qtd_ref_simb[i].nome_simbolo+"</span></a>");

        }
        
        aoCarregarPagina();
        
    });

   // return 0;

 }




function contarReferências(){

    var promise = meuAjax("GET", "xml/lexico.xml", "xml");

    var qtd_ref_simb = [];

    promise.success(function (xml) {


        $(xml).find("lexico").each(function(){

            var nome_simb_atual = $(this).find("nome_simbolo").find("texto").text()
            
            var id_simb_atual = $(this).find("nome_simbolo").attr("id");

            var num_ref_simb = verificarSimbolosQueReferenciam(id_simb_atual, true);

            var simb_atual = {nome_simbolo:nome_simb_atual, id_simb:id_simb_atual, qtd_ref:num_ref_simb};

            qtd_ref_simb.push(simb_atual);

        });

        for (var i = 0; i < qtd_ref_simb.length; i++) {

            var qtd = qtd_ref_simb[i].qtd_ref;

            alert(qtd);

            var class_simb = "";
            
            if (qtd <= 7){

                class_simb = "weight-1"; 

            }else if(qtd <= 14){

                class_simb = "weight-2";

            }else if(qtd <= 21){

                class_simb = "weight-3";

            }else if(qtd <= 28){

                class_simb = "weight-4"; 

            }else {

                class_simb = "weight-5";

            }

            $("#tag_cloud").append(" <a data-id-simb-ref='"+qtd_ref_simb[i].id_simb+"' class='ref_simbolo' href ='#' ><span class='"+class_simb+"'>"+qtd_ref_simb[i].nome_simbolo+"</span></a>");

        }

       
                        
    });   


}






//########################################################################################################
//lexicon module

var lexiconModule = {
 
    searchByLexiconSymbol: function(searchTerm, byId){

    //MAKE AJAX REQUEST  
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

            //alert("comparando : "+$.trim(termo_pesquisa.toLowerCase())+" ----- com :"+$.trim(texto_comparacao.toLowerCase()));

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


                //assembles notion text
                $(this).find("nocao").find("texto").each(function(){

                                             
                    // Verify references to other symbols in notion text    
                    if ($(this).is('[referencia_lexico]')) {

                        var referencedSymbolId = $(this).attr("referencia_lexico");

                        symbolNotion = symbolNotion + "<a data-id-simb-ref='"+referencedSymbolId+"' class='ref_simbolo' href='#'>" + " " + $(this).text() + "</a>" + " ";
                    
                    }else{
                        symbolNotion = symbolNotion + " " + $(this).text() + " ";
                    }

                });


                 //assembles impact text 
                $(this).find("impacto").find("texto").each(function(){

                     // Verify references to other symbols in impact text  
                     if ($(this).is('[referencia_lexico]')) {

                        var referencedSymbolId = $(this).attr("referencia_lexico");

                        symbolImpact = symbolImpact + "<a data-id-simb-ref='"+referencedSymbolId+"' class='ref_simbolo' href ='#' >"+" "+$(this).text()+"</a>"+ " ";

                    }else{

                        symbolImpact = symbolImpact + " " + $(this).text() + " ";  

                    }

                });

         
                objSymbolFound.symbolId = symbolId;
                objSymbolFound.symbolName = symvolName;
                objSymbolFound.symbolNotion = symbolNotion;
                objSymbolFound.symbolImpact= symbolImpact;
                objSymbolFound.symbolSynonyms = symbolSynonyms;

                alert("inside :>"+objSymbolFound.symbolNotion)

                //CHANGE OTHERS SYMBOLS
                lexiconModule.changeOthersSymbols();

                //CHANGE MAIN SYMBOL
                lexiconModule.changeMainSymbol(objSymbolFound);
                
            }
        });
    });
    
},

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

   
//MAKE AJAX REQUEST  
returnSymbolsThatReference: function (symbolId) {
    
    //
    var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

    var symbolsThatReference = [];

    promise.success(function (xml) {

        $(xml).find("lexico").each(function(){

            var currentSymbolId = $(this).find("nome_simbolo").attr("id");

            var currentSymbolName = $(this).find("nome_simbolo").find("texto").text();

            var currentSymbolWasFound = false;

            // Verify notion 
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

                 //Verify impact
                $(this).find("impacto").find("texto").each(function(){

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
                    referencesText = referencesText + "<a data-id-simb-ref='"+symbolsThatReference[i].symbolId+"' class='ref_simbolo' href ='#' >"+" "+symbolsThatReference[i].symbolName+"</a>";
                }else{
                    referencesText = referencesText + ", <a data-id-simb-ref='"+symbolsThatReference[i].symbolId+"' class='ref_simbolo' href ='#' >"+" "+symbolsThatReference[i].symbolName+"</a>";
                }
               
            }

            referencesText = referencesText + ".";

            $("#ref_simb1").html(referencesText);
        }

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
                    parseXmlBusca(searchText, false);
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

    createLexiconCloud: function () {

        //MAKE AJAX REQUEST
        var promise = ajaxModule.ajaxRequest("GET", "xml/lexico.xml", "xml");

        var amoutOfReferencesOfEachSymbol = [];

        promise.success(function (xml) {

            // stores the name, id and amout of references of all lexicon symbos in an array.
            $(xml).find("lexico").each(function(){

                var currentSymbolName = $(this).find("nome_simbolo").find("texto").text()
                
                var currentSymbolId = $(this).find("nome_simbolo").attr("id");

                var amoutOfSymbolReferences = verificarSimbolosQueReferenciam(id_simb_atual, true);

                var currentSymbol = {symbolName:currentSymbolName, symbolId:currentSymbolId, symbolAmoutOfReferences:amoutOfSymbolReferences};

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

                // add the lexicon symbol in the cloud
                $("#tag_cloud").append(" <a data-id-simb-ref='"+amoutOfReferencesOfEachSymbol[i].symbolId+"' class='ref_simbolo' href ='#' ><span class='"+symbolCSSClass+"'>"+amoutOfReferencesOfEachSymbol[i].currentSymbolName+"</span></a>");

            }

                               
        });  

    },
 
  // override the current configuration
    updateMyConfig: function() {
 
        
    }

};

//########################################################################################################
//ajax module

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
 
// Outputs: Where in the world is Paul Irish today?
//myModule.saySomething();


// var myModule = {
 
//   myProperty: "someValue",
 
//   // object literals can contain properties and methods.
//   // e.g we can define a further object for module configuration:
//   myConfig: {
//     useCaching: true,
//     language: "en"
//   },
 
//   // a very basic method
//   saySomething: function () {
//     console.log( "Where in the world is Paul Irish today?" );
//   },
 
//   // output a value based on the current configuration
//   reportMyConfig: function () {
//     console.log( "Caching is: " + ( this.myConfig.useCaching  ? "enabled" : "disabled") );
//   },
 
//   // override the current configuration
//   updateMyConfig: function( newConfig ) {
 
//     if ( typeof newConfig === "object" ) {
//       this.myConfig = newConfig;
//       console.log( this.myConfig.language );
//     }
//   }
// };
 
// // Outputs: Where in the world is Paul Irish today?
// myModule.saySomething();