var myApp = angular.module('myApp', ["filters", "ngRoute"]);

myApp.directive('fileInput', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      var model = $parse(attributes.fileInput);
      var modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
myApp.config(["$routeProvider", function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./view/home.html",
    })
    .when("/category_listing", {
      templateUrl: "./view/category_listing.html",
      controller: "categoryctrl",
    })
    .when("/product_listing", {
      templateUrl: "./view/product_listing.html",
      controller: "productctrl",
    })
    .when("/category_new", {
      templateUrl: "./view/category-new.html",
      controller: "categorynewctrl",
    })
    .when("/category_edit", {
      templateUrl: "./view/category-edit.html",
      controller: "categorynewctrl",
    })
    .when("/product_detail/:id", {
      templateUrl: "./view/product-detail.html",
      // controller: "productctrl"
      controller: "productdetailctrl"
    })
    .when("/product_edit/:id", {
      templateUrl: "./view/product-edit.html",
      controller: "productEdit"
    })
    .when("/product_new", {
      templateUrl: "./view/product-new.html",
      controller: "productctrl",
    })
    .otherwise({ templateUrl: "./views/404.html" });
}
])
  .controller("categoryctrl", function ($scope) {
    $scope.orderByField = "name";
    $scope.reverseOrder = false;
    $scope.searchType = "name";
    $scope.searchText = "";
  })
  .controller("productctrl", function ($scope, $http) {
    $scope.orderByField = "brand";
    $scope.reverseOrder = false;
    $scope.searchType = "brand";
    $scope.searchText = "";
    $scope.productToDelete = null;

    $scope.submitForm = function () {
      const reader = new FileReader();
    reader.onloadend = function () {
      const base64Image = reader.result; // Extract base64 string

      const field = {
        id: $scope.all.length + 1,
        brand: $scope.brandName,
        model: $scope.modelName,
        description: $scope.description,
        price: $scope.price,
        colors: $scope.colors,
        image: base64Image,
        display_type: $scope.Dtype,
        display_size: $scope.Dsize,
        processor: $scope.processor,
        camera: $scope.camera,
        battery: $scope.battery,
        features: $scope.features,
      };

      $http.post('https://mobile-project-backend.onrender.com/product/data', field)
        .then(function (response) {
          showAlert('Product added successfully');
          $scope.getData();
          window.location.href = '#!/product_listing';
        })
        .catch(function (error) {
          console.error('Error adding product:', error);
        });
    };

    reader.readAsDataURL($scope.imageFile); // Read the file
  };

    $scope.getData = function () {
      $http.get('https://mobile-project-backend.onrender.com/product/data')
        .then(function (response) {
          $scope.all = response.data;
        })
        .catch(function (error) {
          console.error('Error fetching data:', error);
        });
    };
    
    // Function to delete a product
  //   $scope.deleteProduct = function (id) {
  //     if (confirm("Are you sure you want to delete this product?")) {
  //         $http.delete('https://mobile-project-backend.onrender.com/product/data/' + id)
  //             .then(function (response) {
  //               showAlert('Product deleted successfully');
  //                 $scope.getData();
  //             })
  //             .catch(function (error) {
  //                 console.error('Error deleting product:', error);
  //             });
  //     }
  // };
  $scope.showDeleteConfirm = function(id) {
    $scope.productToDelete = id;
    $('#confirmModal').modal('show');
  };

  $scope.confirmDelete = function() {
    if ($scope.productToDelete) {
      $http.delete('https://mobile-project-backend.onrender.com/product/data/' + $scope.productToDelete)
        .then(function(response) {
          $('#confirmModal').modal('hide');
          showAlert('Product deleted successfully');
          $scope.getData();
        })
        .catch(function(error) {
          console.error('Error deleting product:', error);
        });
    }
  };

    // Initialize
    $scope.getData();


  })
  .controller("productdetailctrl", function ($scope, $http, $routeParams) {
    const productId = $routeParams.id;

    $http.get('https://mobile-project-backend.onrender.com/product/data/' + productId).then(function (response) {
      $scope.selectedProduct = response.data;
      // console.log(selectedProduct);
    });
  })

  .controller("productEdit", function ($http, $scope, $routeParams) {
    const productId = $routeParams.id;

    $http.get('https://mobile-project-backend.onrender.com/product/data/' + productId).then(function (response) {
      $scope.product = response.data;
      // console.log(selectedProduct);
    });
    $scope.updateForm = function () {

      $http.put('https://mobile-project-backend.onrender.com/product/data/' + productId, $scope.product)
        .then(function (response) {
          showAlert('Product updated successfully');
          window.location.href = '#!/product_listing';
        })
        .catch(function (error) {
          console.error('Error adding data:', error);
        });
    };

  })
  .controller("categorynewctrl", function ($scope) {
    $scope.dateRegex = /^(0?[1-9]|[12][0-9]|3[01]) (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/; // MM/DD/YYYY format

    $scope.validateDate = function (dateString) {
      if (!dateString.match($scope.dateRegex)) {
        $scope.invalidDate = true;
      } else {
        $scope.invalidDate = false;
      }
    };
  })

// myApp.run(function ($rootScope, $http, $location) {
//   $http.get("json/all.json").then(function (res) {
//     $rootScope.all = res.data;
//   }),
//     $http.get("json/categories.json").then(function (res) {
//       $rootScope.categories = res.data;
//   });
//   $rootScope.$on("$locationChangeSuccess", function () {
//     console.log($location.path());
//     $rootScope.page = $location.path();
//   });
// });
