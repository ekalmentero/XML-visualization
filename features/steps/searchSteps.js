var searchSteps = function() {
  this.World = require("../support/world.js").World;

  this.Given(/^Im am on the main page of the site$/, function(callback) {
    this.visit("http://nitanilla.com/visualizer/visualizer3/stable/");
  });

  this.Given(/^it has the Lexico of Transparency loaded$/, function(callback) {
  });
 
  this.Given(/^I fill in the search box "#searchText" with an existing symbol$/, function(callback) {
  });

  this.When(/^I press "Pesquisar" within "#searchForm"$/, function(callback) {
  });

  this.Then(/^I should see the content of the symbol information within "#firstQuadrant"$/, function(callback) {
  });
};
