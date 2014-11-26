#User Stories

###US-1  
> As a user I want to be able to search a word so I could read its meaning in the Lexicon

###US-2:
> As a user I want to be able to import a xml file so I could upload the XML gerated in the C&L

###US-3:  
> As a user I want to be able to import any xml file so I could upload any XML of Lexicon

###US-4:  
>As a user I want the page divided in 4 so I can visualize the current word I searched and the last three ones that I've been reading  

###US-5:  
>As a user I want to be helped in the search so I could see what words its available with a letter

###US-6:  
>As a user I want a cloud presentation of all the words existing so I could visualize how much a word is referenced in the Lexicon



#scenario-searche
from [US-1](#us-1)
Search a word in the Lexicon #US-1

    Objective: read the lexicon-word searched
    Context: place: anywhere which has a browser. estado: the user wants to know the meaning of a word in the lexicon.
    Roles: user
    Resources: Browser, xml uploaded in the site.
    Exceptions: the user doesnt found any word
    Episodies:
    -the user insert the first letter of the word in the search box
    -the site shows the words existing in the lexicon
    -the user selects the word
    -the site shows the content of the word
    constrains: the xml wanted to read had to be imported
