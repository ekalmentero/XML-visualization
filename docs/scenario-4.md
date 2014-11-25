###scenario-4
**visualize the history of navigation in a four-quadrant presentation [#US-4](user-stories-lexico-visualizator.md#us-4)**  

> **Objective**: visualize the relations between the words searched in the Lexicon  
> **Context**: place: anywhere which has a browser. estado: the user is reading the lexicon  
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
>  - the site moves the first word searched to the fourth quadrant, the second to the third quadrant, the third to the second quadrant and shows the meaning of the current word searched to the first quadrant  
> **constrains**: [the xml wanted to read had to be imported](scenario-2.md#scenario-2)
