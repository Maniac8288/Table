  var viewModel = {
        Name: ko.observable(""),
        LastName: ko.observable(""),
        editDisplay: ko.observable(false),
        ID:(""),
    people: ko.observableArray([
        {id:0, firstName : 'Максим' , lastName: 'Звинаревский'},
          {id:1,firstName : 'Владимир' , lastName: 'Спивоченко'},
         {id:2,firstName : 'Петр' , lastName: 'Драган'}
        

    ])
};
var self = viewModel;

viewModel.addPerson = function () {

    self.people.push({  firstName: self.Name() , lastName: self.LastName()})  
    self.Name("");
    self.LastName("");
};
viewModel.removePerson = function(){
    self.people.remove(this);
};
    viewModel.sortItems = function() {
        self.people.sort();
    };
    viewModel.Display = function(){
        
        if(self.editDisplay(false)){
            self.editDisplay(true);
        }
        else self.editDisplay(false);
    };
viewModel.editPerson = function (id) {

    self.people[id]({firstName: self.Name() , lastName: self.LastName()})  
    self.Name("");
    self.LastName("");
};
ko.applyBindings(viewModel);
