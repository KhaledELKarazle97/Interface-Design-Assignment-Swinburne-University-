/*global angular*/
var app = angular.module('myApp', ['firebase']);




app.directive('headerFile', function () {
    return {
        restrict: 'E',
        templateUrl: 'Header/Header.html'
    };
});

app.directive('footerFile', function () {
    return {
        restrict: 'E',
        templateUrl: 'Footer/Footer.html'
    };
});


app.controller("showevent", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    $scope.events = $firebaseArray(ref.child('events'));
    $scope.updateevent = function (id) {
        $scope.indexValue = $scope.events.findIndex(events => events.$id === id);
    };
    $scope.eventperpage = 3;
    $scope.currentPage = 0;
    $scope.pageCount = function () {
        return Math.ceil($scope.events.length / $scope.eventperpage) - 1;
    };

    $scope.range = function () {
        var rangeSize = 5;
        var numForPagiBtns = [];
        var start = $scope.currentPage;
        var i;
        if (rangeSize > $scope.pageCount()) {
            rangeSize = $scope.pageCount() + 1;
        }
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }

        for (i = start; i < start + rangeSize; i++) {
            numForPagiBtns.push(i);
        }
        return numForPagiBtns;
    };

    //Set the current page to the number pressed by user in pagination
    $scope.setPage = function (n) {
        $scope.currentPage = n;
    };

    //Some navigating function for pagination
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };
    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };



    app.filter("offset", function () {
        return function (input, start) {
            if (!input || !input.length) {
                return;
            }
            start = parseInt(start, 10);
            return input.slice(start);
        }

    });

}]);




app.controller("showNewsController", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {

    var ref = firebase.database().ref();
    "use strict";
    $scope.newsImages = $firebaseArray(ref.child('newsImages'));

    $scope.update = function (id) {
        $scope.indexValue = $scope.newsImages.findIndex(newsImages => newsImages.$id === id);
    };

    $scope.newsperpage = 2;
    $scope.currentPage = 0;
    $scope.pageCount = function () {
        return Math.ceil($scope.newsImages.length / $scope.newsperpage) - 1; //divide the objects in json over how many pages
    };

    //setting number for pagination button to be display
    $scope.range = function () {
        var rangeSize = 2;
        var numForPagiBtns = [];
        var start = $scope.currentPage;
        var i;
        if (rangeSize > $scope.pageCount()) {
            rangeSize = $scope.pageCount() + 1;
        }
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }

        for (i = start; i < start + rangeSize; i++) {
            numForPagiBtns.push(i);
        }
        return numForPagiBtns;
    };

    //Set the current page to the number pressed by user in pagination
    $scope.setPage = function (n) {
        $scope.currentPage = n;
    };

    //Some navigating function for pagination
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };
    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };
}]);


app.filter("offset", function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = parseInt(start, 10);
        return input.slice(start);
    }
});





app.controller("showAnn", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    "use strict";
    $scope.official_announcements = $firebaseArray(ref.child('official_announcements'));

    $scope.update = function (id) {
        $scope.indexValue = $scope.official_announcements.findIndex(official_announcements => official_announcements.$id === id);
    };
    $scope.annperpage = 3;
    $scope.currentPage = 0;
    $scope.pageCount = function () {
        return Math.ceil($scope.official_announcements.length / $scope.annperpage) - 1;
    };

    $scope.range = function () {
        var rangeSize = 5;
        var numForPagiBtns = [];
        var start = $scope.currentPage;
        var i;
        if (rangeSize > $scope.pageCount()) {
            rangeSize = $scope.pageCount() + 1;
        }
        if (start > $scope.pageCount() - rangeSize) {
            start = $scope.pageCount() - rangeSize + 1;
        }

        for (i = start; i < start + rangeSize; i++) {
            numForPagiBtns.push(i);
        }
        return numForPagiBtns;
    };

    //Set the current page to the number pressed by user in pagination
    $scope.setPage = function (n) {
        $scope.currentPage = n;
    };

    //Some navigating function for pagination
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    $scope.prevPageDisabled = function () {
        return $scope.currentPage === 0 ? "disabled" : "";
    };
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
    };
    $scope.nextPageDisabled = function () {
        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };



    app.filter("offset", function () {
        return function (input, start) {
            if (!input || !input.length) {
                return;
            }
            start = parseInt(start, 10);
            return input.slice(start);
        }
    })
}]);


app.controller("feedbackcontrol", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {

    var ref = firebase.database().ref();
    "use strict";
    $scope.postIt = $firebaseArray(ref.child('feedback'));
    $scope.sts = "Pending";
    $scope.isSent = false;
    $scope.popout = "";
    $scope.sendfeed = function () {
        var timestamp = new Date();

        var max = 000000;
        var min = 999999;
        $scope.id = Math.floor(Math.random() * (max - min + 1)) + min;



        if ($scope.senderName != null && $scope.email != null && $scope.phone != null && $scope.feedType != null && $scope.msg != null) {
            $scope.postIt.$add({
                FeedID: $scope.id,
                Name: $scope.senderName,
                Email: $scope.email,
                PhoneNumber: $scope.phone,
                Service: $scope.feedType,
                Message: $scope.msg,
                Status: $scope.sts,
                time: timestamp.toString().slice(0, 24)

            });
            $scope.popout = "Thank you for your feedback, your feedback ID is <strong>" + $scope.id + "</strong> You can use this ID anytime to check the status of your feedback by clicking on Check Status";
            $scope.senderName = "";
            $scope.email = "";
            $scope.phone = "";
            $scope.feedType = "";
            $scope.msg = "";

        } else {
            $scope.popout = "Some Information are missing!"
        }

        bootbox.alert({
            message: $scope.popout,
            buttons: {
                ok: {
                    label: 'OK',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {}
        });;
    }

}]);




app.controller("checkfeed", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    $scope.infoexist = false;
    $scope.feed = "";
    $scope.feedid = '';
    var userStatus = document.getElementById('user_status');
    var ref = firebase.database().ref();

    "use strict";
    $scope.feedback = $firebaseArray(ref.child('feedback'));

    $scope.searchfeed = function (id) {
        $scope.indexValue = $scope.feedback.findIndex(feedback => feedback.$id === id);
        for (var i = 0; i < $scope.feedback.length; i++) {
            if ($scope.feedid == $scope.feedback[i].FeedID) {
                $scope.feedid = $scope.feedback[i].FeedID;
                $scope.name = $scope.feedback[i].Name;
                $scope.email = $scope.feedback[i].Email;
                $scope.phone = $scope.feedback[i].PhoneNumber;
                $scope.type = $scope.feedback[i].Service;
                $scope.status = $scope.feedback[i].Status;
                $scope.subtime = $scope.feedback[i].time;
                $scope.infoexist = true;
                $scope.feed = "Your Feedback Details Are:";
                break;

            } else {
                $scope.infoexist = false;
                $scope.feed = "Error: We Could Not Find Your Information,Please Ensure That You Are Using The Correct Feedback ID Otherwise, Please Send us an email."
            }

        }
        if ($scope.status === 'Pending') {
            userStatus.style.color = "red";
        }
        if ($scope.status === 'Reviewed') {
            userStatus.style.color = "blue";
        }
        if ($scope.status === 'Resolved') {
            userStatus.style.color = "green";
        }
    };
}]);
