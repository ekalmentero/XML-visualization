
| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

> **Objective**: read the lexicon-word searched  
> **Context**: place: anywhere which has a browser. estado: the user wants to know the meaning of a word in the lexicon
> **Roles**:  user  
> **Resources**: Browser, xml uploaded in the site.  
> **Exceptions**: the user doesnt found any word  
> **Episodies**:  
>  -the user insert the first letter of the word in the search box  
>  -[the site shows the words existing in the lexicon](scenario-5.md#scenario-5)  
>  -the user selects the word  
>  -the site shows the content of the word  
> **constrains**: [the xml wanted to read had to be imported](scenario-2.md#scenario-2)  
