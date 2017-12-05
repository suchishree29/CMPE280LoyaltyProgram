var app = angular.module("loyalty", ["ngRoute"]);
app.service('orderDetails', function() {
	return {
		getOrder: function(){
			return this.order;
		},
		setOrder: function(order){
			this.order = order;
		}
	};
});
app.service('userDetails', function() {

    return {
        setFirstName: function(fname) {
            this.firstName = fname;
        },
        setId : function (id){
            this._id = id;
        },
        setTotalPoints : function (totalPoints) {
            this.totalPoints = totalPoints

        },
        getFirstName: function(){
            return this.firstName;
        },
        getId :function(){
            return this._id;
        },
        getTotalPoints :function(){
            return this.totalPoints;
        },

    };
  
  });


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/signup", {
        templateUrl : "signup.html"
    })
    .when("/dashboard", {
        templateUrl : "dashboard.html"
    })
    .when("/admin", {
        templateUrl : "admin.html"
    })
    .when("/adminLogin", {
        templateUrl : "adminDashboard.html"
    })
    .when("/getOrderDetails", {
        templateUrl : "orderDetails.html"
    })
    .when("/voucher", {
        templateUrl : "voucher.html"
    })
    .when("/getTransactionDetails", {
        templateUrl : "transactionhistory.html"
    })
    .when("/referFriends", {
        templateUrl : "referFriends.html"
    })
        .when("/analyticsDetails", {
            templateUrl : "analytics.html"
        });

});
app.controller('analytics', function($scope, $http){
    console.log("In Analytics Controller");
    google.charts.setOnLoadCallback($scope.drawChart);

    $scope.drawChart = function() {
        var customerDataArr = [];
        var url = "getCustomerData";
        $http.get(url)
            .then(
                function(response){
                    console.log("Customer Data success");
                    $scope.customerData = response.data
                    console.log($scope.customerData[0].username);

                    customerDataArr.push(['username','amount']);
                    for(var i=0; i < $scope.customerData.length;i++){
                        var username = $scope.customerData[i].username;
                        var amount = $scope.customerData[i].totalBillAmount;
                        customerDataArr.push([username,amount]);
                    }

                    var data = google.visualization.arrayToDataTable(customerDataArr);

                    var options = {
                        title: 'My Customer Activities'
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

                    chart.draw(data, options);
                },
                function(response){
                    console.log("Customer Data failed");
                }
            );
    }
});

app.controller('voucher', function($scope, $http){
    $scope.addPoints = function() {
	var url = "addPoints";
	var Points = {
		amount : $scope.amount,
		email : $scope.email
	};
        $http.post(url,Points)
        .then(
            function(response){
                console.log("Points Saved");
                $scope.amount = "";
                $scope.email = "";
            }), 
            function(response){
                console.log("Could not save Points");

            }
    }
});

app.controller('referFriends', function($scope, $http, $location){
    $scope.referFriends = function() {
	var url = "/referFriends";
	var data = {
		name : $scope.name,
		email : $scope.email
	};
        $http.post(url,data)
        .then(
            function(response){
                $scope.validEmail = true;
                alert("Email sent successfully!!");
                console.log("Referral Mail Sent");
                $scope.name = "";
                $scope.email = "";
                $location.path("/dashboard");

            },
            function(err){
                console.log(err);
                $scope.invalidEmail = true;
                console.log("Referral mail not sent");
            })

    }
});




app.controller('adminDashboard', function($scope, $http, $location, orderDetails){
		console.log("admin dashboard controller");
		var url = "getCustomerData";
        $http.get(url)
            .then(
                function(response){
                    console.log("Customer Data success");
					$scope.customerData = response.data
                },
            function(response){
                console.log("Customer Data failed");
            }
		);

		$scope.showOrderDetails = function(customer){
            console.log("*************In transaction method client side *****************")
            var userid = customer._id;
            console.log("User Id client side is ",userid);
            var url="/getTransactionDetails/"+userid;
            console.log("url is",url);
            $scope.orders = [];
    
            $http.get(url)
                .then(
                    function(response){
                        console.log("Response in client side", response.data.orders);
   						orderDetails.setOrder(response.data.orders);

                        $location.path("/getOrderDetails");
                        //console.log("Response in $scope.orders ", $scope.orders[0] );
                        //$scope.vouchers.push(response.data);
                    }),
                function(err){
                    console.log("Dashboard loading failed");
                }
        }
        



});

app.controller('root', function($scope, $http, userDetails, $location){
    $scope.user = {};
    $scope.admin = {};
    $scope.user.loggedIn = false;
    $scope.admin.loggedIn = false;

    $scope.getTransactionDetails = function () {
        console.log("*************In transaction method client side *****************")
        var userid = userDetails.getId();
        console.log("User Id client side is ",userid);
        var url="/getTransactionDetails/"+userid;
        console.log("url is",url);
        $scope.orders = [];

        $http.get(url)
            .then(
                function(response){
                    console.log("Response in client side", response.data.orders);
                    $scope.orders = response.data.orders;


                    $location.path("/getTransactionDetails");
                    //console.log("Response in $scope.orders ", $scope.orders[0] );
                    //$scope.vouchers.push(response.data);
                }),
            function(err){
                console.log("Dashboard loading failed");
            }
    }

    $scope.referFriends = function(){
        $location.path("/referFriends");

    }

    $scope.signOut = function(){
        $location.path("/");
        $scope.user.loggedIn = false;
        $scope.admin.loggedIn = false;

    }

    $scope.goToDashboard = function () {
        $location.path("/dashboard");
    }

    $scope.goToAdminDashboard = function () {
        $location.path("/adminLogin");
    }
    $scope.analytics = function () {
        $location.path("/analyticsDetails");
    }



});

app.controller('dashboard', function($scope, $http, userDetails, $location){
    console.log("get first name");
    console.log(userDetails.getFirstName());
    $scope.firstName = userDetails.getFirstName();
    $scope.totalPoints = userDetails.getTotalPoints();

    $scope.getVoucherDetails = function () {
        console.log("*************In client side *****************")
        var url="/getVoucherDetails"
        $scope.vouchers = [];
        $http.get(url)
            .then(
                function(response){
                    console.log("Response in client side", response.data.vouchers);
                    $scope.vouchers = response.data.vouchers;

                }),
            function(response){
                console.log("Dashboard loading failed");
            }
    }

    $scope.redeemCoupon = function (coupon) {
        console.log(coupon);
        var date = new Date();
        console.log("Date is",date);
        
        coupon.date = new Date();
        coupon.userid = userDetails.getId();
        var url="/redeemCoupon"
      
        $http.post(url,coupon )
        .then(
            function(response){
                console.log("Redeem coupon scope mein hai",response)
                console.log(response.updatedPoints);
                userDetails.setTotalPoints(response.data.updatedPoints);
                $scope.totalPoints = response.data.updatedPoints;
                console.log("Scope ka total pointsssssssss",$scope.totalPoints);
		        coupon.redeemed = true;
            }), 
            function(response){
                console.log("Could not save data");
            }
    }

});

app.controller('orderDetails', function($scope, $http, userDetails, orderDetails) {
   	$scope.orders = orderDetails.getOrder();
});

app.controller('signup', function($scope, $http, $location, userDetails) {
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.userName = "";
    $scope.password = "";
    $scope.passwordConfirm = "";
    $scope.email = "";
    $scope.phone = "";

	$scope.submitData = function(){
		console.log($scope.firstName, $scope.lastName, $scope.userName, $scope.password, $scope.email, $scope.phone);
		var url="/userSignup"
		var data = {
			"firstName" : $scope.firstName,
			"lastName" : $scope.lastName,
			"userName" : $scope.userName,
			"password" : $scope.password,
			"email" : $scope.email,
			"phone" : $scope.phone,
		};
                $http.post(url, data)
                   .then(
                       function(response){
                         // success callback
                           $location.path("/login");
			   console.log("saved");
                       }, 
                       function(response){
                         // failure callback
			console.log("failed");
                       }
                    );
}
    
    $scope.login = function(){
		var data = {
			"userName" : $scope.userName,
			"password" : $scope.password
        };
		if(data.userName == "admin"){
        		$scope.admin.loggedIn = true;
            		$location.path("/adminLogin");
		} else {
        	var url="/login"
        $http.post(url, data)
        .then(
            function(response){
        	$scope.user.loggedIn = true;
                console.log("logged in");
                //$scope.data = response.data;
                userDetails.setFirstName(response.data.fname);
                userDetails.setTotalPoints(response.data.totalPoints);
                userDetails.setId(response.data._id);
                $location.path("/dashboard");
            }, 
            function(err){
		        console.log(err);
		        $scope.invalidLogin = true;
                console.log("log in failure");
            }
		)
		}	
    }

});

app.controller('admin', function($scope, $http, $location, userDetails) {
        $scope.voucherName = "";
        $scope.points = "";
        $scope.value = "";
        $scope.voucherCode = "";
    
        $scope.addItemData = function(){
            console.log($scope.voucherName, $scope.points, $scope.value, $scope.voucherCode);
            var url="/addItem"
            var data = {
                "voucherName" : $scope.voucherName,
                "points" : $scope.points,
                "value" : $scope.value,
                "voucherCode" : $scope.voucherCode
            };
                    $http.post(url, data)
                       .then(
                           function(response){
                             // success callback
                             console.log("Data saved");
                             $scope.voucherName = "";
                             $scope.points = "";
                             $scope.value = "";
                             $scope.voucherCode = "";
                           }, 
                           function(response){
                             // failure callback
                             console.log("failed");
                           }
                       );
        }
});

