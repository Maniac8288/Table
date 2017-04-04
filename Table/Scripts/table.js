var viewModel = {
    addUsersViewModel: new Users(),

    paginationViewModel: new Pagination(),
    Display: ko.observable(),
};


// Модель студентов
function Users(id, firstName, lastName) {
    var self = this;

    // Отслеживание изменений
    self.Id = ko.observable(id);
    self.FirstName = ko.observable(firstName);
    self.LastName = ko.observable(lastName);
    
    // Добавление пользовотеля
    self.addUser = function () {
        var dataObject = ko.toJSON(this);

        $.ajax({
            url: '/home/AddUsers',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                viewModel.paginationViewModel.users
                    .push(new Users(data.Id, data.FirstName, data.LastName));
                self.Id=null;
                self.FirstName('');
                self.LastName('');
            }
        });
    };
    self.editUserDisplay = function (user) {
        
        viewModel.Display(true);
        $('#FirstName').val(user.FirstName());
        $('#LastName').val(user.LastName());
        $('#ID').val(user.Id());
       
     
       
    };
    self.editUser = function (user) {
        self.Id = $('#ID').val();
        self.FirstName = $('#FirstName').val();
        self.LastName = $('#LastName').val();
        var dataObject = ko.toJSON(this);
        $.ajax({
            url: '/home/EditUser',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                viewModel.paginationViewModel.getUsers();
                viewModel.Display(false);
            }

        });
       
    
    };

}
// Постраничный вывод списка студентов
function Pagination() {
    var self = this;

    // Отслеживание изменений в списке пользователей
    self.users = ko.observableArray([]);

    // Список пользователей
    self.getUsers = function () {
        self.users.removeAll();

        // Загрузка списка студентов с сервера
        $.getJSON('/home/GetUsers', function (data) {
            $.each(data, function (key, value) {
                self.users.push(new Users(value.Id, value.FirstName, value.LastName));
            });
        });
    };

    // Удаление студента из списка
    self.removeUsers = function (user) {
        $.ajax({
            url: '/home/DeleteUser/' + user.Id(),
            type: 'post',
            contentType: 'application/json',
            success: function () {
                self.users.remove(user);
            }
        });
    };

    self.currentPage = ko.observable();
    self.pageSize = ko.observable(5);
    self.currentPageIndex = ko.observable(0);

    self.currentPage = ko.computed(function () {
        var pagesize = parseInt(self.pageSize(), 10),
        startIndex = pagesize * self.currentPageIndex(),
        endIndex = startIndex + pagesize;
        return self.users.slice(startIndex, endIndex);
    });
    self.nextPage = function () {
        if (((self.currentPageIndex() + 1) * self.pageSize()) < self.users().length) {
            self.currentPageIndex(self.currentPageIndex() + 1);
        }
        else {
            self.currentPageIndex(0);
        }
    };
    self.previousPage = function () {
        if (self.currentPageIndex() > 0) {
            self.currentPageIndex(self.currentPageIndex() - 1);
        }
        else {
            self.currentPageIndex((Math.ceil(self.users().length / self.pageSize())) - 1);
        }
    };
    ///Сортировка
    self.sortType = "ascending";
    self.currentColumn = ko.observable("");
    self.iconType = ko.observable("");
    self.sortTable = function (users, e) {
        var orderProp = $(e.target).attr("data-column")
        self.users.sort(function (left, right) {
            leftVal = left[orderProp];
            rightVal = right[orderProp];
            if (self.sortType == "ascending") {
                return leftVal < rightVal ? 1 : -1;
            }
            else {
                return leftVal > rightVal ? 1 : -1;
            }
        });
        self.sortType = (self.sortType == "ascending") ? "descinding" : "ascending";
        self.iconType((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };
}
$(document).ready(function () {
    // Привязка модели
    ko.applyBindings(viewModel);

    // Загрузка списка студентов
    viewModel.paginationViewModel.getUsers();
});
