###scenario-7
**Navigate through the links in the content of a lexicon word [#US-4](user-stories-lexico-visualizator.md#us-4)**  

> **Objective**: Visualize in four quadrants the navigation throught the hyperlinks in the content of the Lexicon  
> **Context**: place: anywhere which has a browser. estado: the user is navigating & reading words in the lexicon  
> **Roles**:  user    
> **Resources**: Browser, xml uploaded in the site.  
> **Exceptions**: the site doesnt show any word in any quadrant at the beginning  
> **Episodies**:  
>  - the user searchs a word in the Lexicon  
>  - the site shows the meaning of the word in the first quadrant  
>  - the user searchs another word in the Lexicon  
>  - the site moves the first word searched to the second quadrant and shows the meaning of the current word searched to the first quadrant  
>  - the user searchs another word in the Lexicon
>  - the site moves the first word searched to the third quadrant, the second to the second quadrant and shows the meaning of the current word searched to the first quadrant  
>  - the user searchs another word in the Lexicon  
>  - the site moves the first word searched to the fourth quadrant, the second to the third quadrant, the third to the second quadrant and shows the meaning of the current word searched to the first quadrant.  
> **constrains**:  [the xml wanted to read had to be imported](user-stories-lexico-visualizator.md#us-2), [the user started to read the lexicon searching a word](scenario-1.md#scenario-1)  
