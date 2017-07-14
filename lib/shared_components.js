var sharedComponents = new function(){

  var self = this;

  //put any shared common methods/functions, variables, modules here
	//if not separately imported somewhere

  this.testMethod = function(args){
    if(typeof args !== 'undefined')
      return "You called shared component test method with: " + JSON.stringify(args);
    else
      return "You called shared component test method";
  };
}
