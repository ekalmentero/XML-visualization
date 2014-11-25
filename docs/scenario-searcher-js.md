###scenario-searcher-js  
**Search a word [#US-1](scenario-1.md#scenario-1)**  

> **Objective**: The user been able to search a word in the lexicon. When doing so, the search box will help the user with an autocomplete showing the existing words.  
> **Context**: place: anywhere which has a browser. estado: the user wants to know the meaning of a word in the lexicon.  
> **Actors**:  user  
> **Resources**: Browser, xml uploaded in the site.  
> **Exceptions**:    
> **Episodies**:  
>  
> #S1.E1 the user insert the first letter of the word in the search box 
> #S1.E2 When typing the word, the searcher will filter the words that match and list them.
> #S1.E3 the user selects a word in the list
> #S1.E4 the searcher shows the content with the following [structure] (scenario-content-html.md)
>
> **constrains**: the content doesnt have all the values of the structure
