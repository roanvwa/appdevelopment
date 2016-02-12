
function ArticlesFactory($http, strg, $q, $filter, $rootScope) {

    var factory = {};
    var dataBaseUrl = $rootScope.host + 'content/app.ashx';
    var articles = null;
    var categories = null;

    var force = true;

    factory.getArticle = function (iCategoryID, iObjectID) {
        var deferred = $q.defer()

        this.getArticles(iCategoryID, force).then(
            function (data) {
                for (var a in data) {
                    if (data[a].objectID == iObjectID) {
                        deferred.resolve(data[a]);
                        return;
                    }
                }
                deferred.reject("Artikel niet kunnen vinden");
            },
            function (err) {
                deferred.reject(err);
            });

        return deferred.promise;


    }

    factory.getArticles = function (iCategoryID, force) {

        // Last checked date 
        var dtLstChecked = new Date(1900, 1, 1);
        var o = strg.get("dtObjlastchecked" + iCategoryID);
        var deferred = $q.defer();

        if (o)
            dtLstChecked = o;

        articles = strg.get('cat_' + iCategoryID);

        function fnArticlesComplete(articles) {
            var article;

            for (key in articles) {

                article = articles[key];

                if (!article.skudata){
                    // Waardes op skuniveau zetten
                    for (key in article.specs) {
                        var spec = article.specs[key];
                        if (spec.dataSpecID > 0) {
                            // Sku opzoeken
                            var sku = article.skus[article.defaultSkuID];
                            var itemID = sku.specItem[spec.dataSpecID];
                            spec.value = spec.sku[itemID];
                        } else {
                            spec.value = spec.sku[0];
                        }
                    }
                    article.skudata = 1;
                }

            }

            deferred.resolve(articles);
        }

        if ((Math.abs(dtLstChecked - new Date()) / (1000 * 60 * 60)) > 24) {
            getArticlesFromServer(iCategoryID, dtLstChecked).then(function (data) {
                fnArticlesComplete(data);
            }, function () {
                deferred.reject("ophalen artikelen van server mislukt");
            });
        } else {
            if (articles)
                fnArticlesComplete(articles);
            else
                getArticlesFromServer(iCategoryID, null).then(function (data) {
                    fnArticlesComplete(data);
                }, function () {
                    deferred.reject("ophalen artikelen van server mislukt");
                });;
        }
        

        return deferred.promise;

    }

    function getArticlesFromServer(iCategoryID, fromDate) {

        var deferred = $q.defer();

        var dataUrl = dataBaseUrl + "?categoryID=" + iCategoryID + "&cmd=objects";

        if (fromDate)
            dataUrl += "&dtfrom=" + $filter('date')(fromDate, "yyyyMMddHHmm");

        $http({ method: 'GET', url: dataUrl }).success(
             function (data) {
                 // category collection
                 strg.set('cat_' + iCategoryID, data);
                 strg.set("dtObjlastchecked" + iCategoryID, new Date());
                 deferred.resolve(data);
             }
         ).error(
             function () {
                 //@hs, todo: nette melding maken.
                 deferred.reject("ophalen artikelen van server mislukt");
             }
         );

        return deferred.promise;
    }

    factory.getCategoryById = function (id) {

        var deferred = $q.defer();

        this.getCategories().then(function (data) {
            for (a in data.Children) {
                if (data.Children[a].CategoryID == id) {
                    deferred.resolve(data.Children[a]);
                    return;
                }
            }
            deferred.reject("ophalen categorienaam mislukt " + err);
        }, function (err) {
            deferred.reject("ophalen categorienaam mislukt " + err);
        });

        return deferred.promise;
    }

    factory.getCategories = function () {


        // Last checked date 
        var dtLstChecked = new Date(1900, 1, 1);
        var o = strg.get("dtCatlastchecked");
        var deferred = $q.defer();

        if (o)
            dtLstChecked = o;

        // Get fromlocal storrage
        if (!categories)
            categories = strg.get('categories');

        if ((Math.abs(dtLstChecked - new Date()) / (1000 * 60 * 60)) > 24) {
            getCategoriesFromServer(dtLstChecked, deferred);
        } else {
            if (categories)
                deferred.resolve(categories);
            else
                getCategoriesFromServer(null, deferred);
        }

        return deferred.promise;

    }

    function getCategoriesFromServer(fromDate, deferred) {

        var dataUrl = dataBaseUrl + "?cmd=categories";

        if (fromDate)
            dataUrl += "&dtfrom=" + $filter('date')(fromDate, "yyyyMMddHHmm");

        $http({ method: 'GET', url: dataUrl }).success(
             function (data) {
                 // category collection
                 strg.set('categories', data);
                 strg.set("dtCatlastchecked", new Date());
                 deferred.resolve(data);
             }
         ).error(
             function (err) {
                 //@hs, todo: nette melding maken.
                 deferred.reject("ophalen categorieen van server mislukt");
             }
         );
    }

    return factory;

}

angular.module('Amazilia').factory('ArticlesFactory', ['$http', 'localStorageService', '$q', '$filter', '$rootScope', ArticlesFactory]);