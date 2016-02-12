
function menuController(articlesFactory) {
    var vm = this;
    vm.categories = {};

    articlesFactory.getCategories().then(
        function (data) {
            vm.categories = data;
        },
        function (err) {
            //@hs, todo: nette melding maken.
            alert(err);
        }
    )
}

angular.module('Amazilia').controller('menuController', ['ArticlesFactory', menuController]);

