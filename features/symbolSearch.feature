Feature: I want to sarch a symbol
  To see the symbol content
  As a user
  I should search a symbol in the site

Background:
  Given Im am on the main page of the site
  And it has the Lexico of Transparency loaded
 
Scenario: I fill the symbol to search
  Given I fill in the search box "#searchText" with an existing symbol
  When I press "Pesquisar" within "#searchForm"
  Then I should see the content of the symbol information within "#firstQuadrant"
#  |Titulo                     | depende 
#  |Noção                      |        
#  |Impacto                    |         
#  |Referencias a este símbolo |
