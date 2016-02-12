//todo , controler dynamisch laden in routeprovider!!
function articleController(articlesFactory, $routeParams) {
    var vm = this;

    vm.article = {};
    vm.categoryName = '';
    vm.categoryID = $routeParams.CategoryID;
    vm.objectID = $routeParams.ObjectID;;

    vm.goBack = function () {
    }

    vm.thmbClick = function (itemID) {
        var spec = vm.article.specs["IMG"];
        spec.value = spec.sku[itemID];
    }
        
    articlesFactory.getArticle(vm.categoryID, vm.objectID).then(function (data) {
        vm.article = data;
    }, function (err) {
        //@hs, todo: nette melding maken.
        alert(err);
    });
      
}
angular.module('Amazilia').controller('articleController', ['ArticlesFactory', '$routeParams', articleController]);

function articlesController(articlesFactory, $routeParams) {
    var vm = this;
    vm.articles = {};
    vm.categoryName = '';
    vm.categoryID = $routeParams.SelectedID;
    vm.objectID = $routeParams.ObjectID;
    
    articlesFactory.getArticles($routeParams.SelectedID).then(function (data) {
        vm.articles = data;

        articlesFactory.getCategoryById($routeParams.SelectedID).then(function (category) {
            vm.categoryName = category.Name;
        }, function (err) { alert(err) });

        if (vm.objectID && Number(vm.objectID > 0)) {
                
        }
    }, function (err) {
        //@hs, todo: nette melding maken.
        alert(err);
    });
}
angular.module('Amazilia').controller('articlesController', ['ArticlesFactory', '$routeParams',  articlesController]);

angular.module('Amazilia').filter('spechorizontal', function () {
    return function (arr, field) {
        var oReturn = [];
        var contains = []
        var item;
        for (key in arr) {
            item = arr[key];
            if (contains.indexOf(item.specItem[field])<0){
                oReturn.push(item);
                contains.push(item.specItem[field]);
            }
        }
        return oReturn;        
    }
});
angular.module('Amazilia').filter('specvertical', function () {
    return function (arr, spec, field2) {
        var oReturn = [];
      
        var item;
        for (key in arr) {
            item = arr[key];
            if (item.specItem[spec] == field2) {
                oReturn.push(item);
                
            }
        }
        return oReturn;
    }
});


//angular.module('Amazilia').directive('vwaSpec', function () {
//    return {
//        restrict : "A",
//        //templateUrl: function (elem, attr) {
//        //    return "views/directives/spec.html"
//        //},
//        scope: {
//            article: '=article',
//            host: '=host',
//            code : '=code'
//        },
//        link: function (scope, element, attrs) {

//            var spec = scope.article.specs[scope.code];

//            if (spec.dataSpecID > 0) {
//                // Sku opzoeken
//                var sku = article.skus[article.defaultSkuID];
//                var itemID = sku.specItem[spec.dataSpecID];
//                scope.value = spec.sku[itemID];
//            } else {
//                scope.value = spec.sku[0];
//            }

//            switch(spec.dataTypeID){
//                case 12: // media
//                    element.attr('src', scope.host + scope.value[0]);
//                    break;
//                case 14: // download
//                    element.attr('href', scope.value[0]);
//                    break;
//                default:
//                    element.html(scope.value);
//                    break;
//            } 
//        }
//    }
//});

