###scenario-4
**As a user I want the page divided in 4 so I can visualize the current word I searched and the last three ones that I've been reading
[#US-4] (user-stories-lexico-visualizator.md#us-4)**

> **Objective**: visualize in four quadrants the navigation throught the Lexicon
> **Context**: place: anywhere which has a browser. estado: the user is reading an associating words to know better the meaning of the Lexicon.
> **Roles**:  user  
> **Resources**: Browser, xml uploaded in the site.  
> **Exceptions**: the site doesnt show any word in any quadrant at the beginning  
> **Episodies**:  
>  -the user searchs a word in the Lexicon  
>  -the site shows the meaning of the word in the first quadrant  
>  -the user searchs another word in the Lexicon  
>  -the site moves the first word searched to the second quadrant and shows the meaning of the current word searched to the first quadrant  
>  -the user searchs another word in the Lexicon
>  -the site moves the first word searched to the third quadrant, the second to the second quadrant and shows the meaning of the current word searched to the first quadrant  
>  -the user searchs another word in the Lexicon  
>  -the site moves the first word searched to the fourth quadrant, the second to the third quadrant, the third to the second quadrant and shows the meaning of the current word searched to the first quadrant  
> **constrains**: [the xml wanted to read had to be imported](user-stories-lexico-visualizator.md#us-2)
