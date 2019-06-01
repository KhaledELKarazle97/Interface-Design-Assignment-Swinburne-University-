/*global angular*/
var app = angular.module('adminapp', ['firebase', 'ngRoute']);


app.config(['$routeProvider', function ($routeProvider) {
    "use strict";
    $routeProvider

        .when('/event', {
            templateUrl: 'Templates/events.html',
            controller: 'eventscontrol'
        })

        .when('/news', {
            templateUrl: 'Templates/newsadmin.html',
            controller: 'announcements'
        })

        .when('/ann', {
            templateUrl: 'Templates/announcements.html',
            controller: 'announcements'
        })

        .when('/feed', {
            templateUrl: 'Templates/feedbackadmin.html',
            controller: 'checkfeed'
        })

        .otherwise({
            templateUrl: 'Templates/events.html',
            controller: 'eventscontrol'
        });

}]);


app.filter('newlines', function () {
    "use strict";
    return function (text) {
        if (text) {

            return text.replace(/\n/g, '<br/>');

            return '';
        }
    };
});

app.filter('nohtml', function () {
    "use strict";
    return function (text) {
        if (text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');
            return '';
        }
    };
});


app.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
        "use strict";
        return $firebaseAuth();
    }
]);

app.controller("adminctrl", ['$scope', '$http', 'firebase', '$firebaseObject', 'Auth', '$firebaseArray', function ($scope, $http, firebase, $firebaseObject, Auth, $firebaseArray) {
    "use strict";
    // AUTH
    $scope.signin = {};
    $scope.signin.state = false;
    $scope.signin.uid = null;
    var ref = firebase.database().ref();
    // CHECKING FOR AUTHORIZATION
    Auth.$onAuthStateChanged(function (user) {

        if (user) {
            $scope.signin.state = true;
            $scope.signin.uid = user.uid;
            $scope.signin.email = user.email;
            var ref = firebase.database().ref();

        } else {
            $scope.signin.state = false;
            $scope.signin.uid = null;
        }
    })

    $scope.signInWithEmailAndPassword = function (email, password) {

        Auth.$signInWithEmailAndPassword(email, password).then(function (firebaseuser) {}).catch(function (error) {

            bootbox.alert({
                message: "Invalid Login Information, Please check your password and / or username",
                buttons: {
                    ok: {
                        size: 'large',
                        label: 'Ok',
                        className: 'btn btn-basic'
                    }
                }
            });

        });

    };

    $scope.signout = function () {
        Auth.$signOut();
    };

}]);

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



app.controller("eventscontrol", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    "use strict";
    $scope.event = $firebaseArray(ref.child('events'));
    $scope.postevent = function () {
        var eventDate = $scope.eventDate;
        var eventTime = $scope.eventTime;
        if ($scope.eventName !== "" || $scope.eventDate !== "" || $scope.eventTime !== "" || $scope.eventOrganizer !== "" || $scope.eventDescribe !== "") {
            bootbox.confirm({
                message: "Are you sure you want to add this event?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn btn-default'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn btn-basic'
                    }
                },
                callback: function (result) {
                    if (result === true) {
                        location.reload();
                        $scope.event.$add({
                            event: $scope.eventName,
                            date: eventDate.toString().slice(0,15),
                            time: eventTime.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute:'numeric',second:'numeric' }),
                            Organizer: $scope.eventOrganizer,
                            Description: $scope.eventDescribe
                        });

                    } else {
                        $('#addeventmodal').modal('hide');
                        $scope.eventName = "";
                        $scope.eventDate = "";
                        $scope.eventTime = "";
                        $scope.eventOrganizer = "";
                        $scope.eventDescribe = "";

                    }
                }
            })
        };

    }


}]);

app.controller("showevent", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    $scope.events = $firebaseArray(ref.child('events'));

    $scope.updateevent = function (id) {
        $scope.indexValue = $scope.events.findIndex(events => events.$id === id);
    };



    $scope.removeevent = function (x) {
        var ref = firebase.database().ref('events/' + x);
        bootbox.confirm({
            message: "You are about to delete this event permanently, do you wish to continue ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-default'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    location.reload();
                    ref.remove();
                }
            }
        });
    };

    $scope.saveEvent = function () {
        bootbox.confirm({
            message: "Would you like to save changes ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-basic'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-default'
                }
            },
            callback: function (result) {
                if (result === true) {
                    $scope.events.$save($scope.indexValue).then(function (data) {});
                    $('#editEventModal').modal('hide');
                    location.reload();
                } else {
                    $('#editEventModal').modal('hide');
                }
            }
        });

    }
}]);



app.controller("newsController", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    "use strict";
    $scope.newsImages = $firebaseArray(ref.child('newsImages'));
    var fileButton = document.getElementById("newspic");
    var storageRef = firebase.storage().ref();

    fileButton.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var pubDate = new Date();
        var imagesRef = storageRef.child('images/news/' + file.name);

        $scope.postnews = function () {

            bootbox.confirm({
                message: "Are you sure you want to post this publication?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn btn-default'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn btn-basic'
                    }
                },
                callback: function (result) {
                    if (result === true) {
                        imagesRef.put(file).then(function (snapshot) {
                            $scope.newsImages.$add({
                                url: snapshot.downloadURL,
                                newsHeading: $scope.newsHeading,
                                subHeading: $scope.subHeading,
                                article: $scope.article,
                                date: pubDate.toString().slice(0, 24)

                            });

                        });
                        $('#addnewsmodal').modal('hide');


                    } else {
                        $('#addnewsmodal').modal('hide');
                        $scope.newsHeading = "";
                        $scope.subHeading = "";
                        $scope.article = "";

                    }
                }
            })
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

    $scope.newsperpage = 3;
    $scope.currentPage = 0;
    $scope.pageCount = function () {
        return Math.ceil($scope.newsImages.length / $scope.newsperpage) - 1; //divide the objects in json over how many pages
    };

    //setting number for pagination button to be display
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

    $scope.removepub = function (x) {
        var ref = firebase.database().ref('newsImages/' + x);
        bootbox.confirm({
            message: "You are about to remove this publication, do you wish to continue?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-default'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    ref.remove();
                }
            }
        });

    };
    $scope.saveNews = function () {
        bootbox.confirm({
            message: "Would you like to save changes ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-basic'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-default'
                }
            },
            callback: function (result) {
                if (result === true) {
                    $scope.newsImages.$save($scope.indexValue).then(function (data) {});
                    $('#editNewsModal').modal('hide');
                    location.reload();
                } else {
                    $('#editNewsModal').modal('hide');
                }
            }
        });

    }

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



app.controller("announcements", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();
    "use strict";
    var date_time = new Date();
    $scope.postIt = $firebaseArray(ref.child('official_announcements'));


    $scope.postann = function () {
        bootbox.confirm({
            message: "Are you sure you want to publish this annoucement?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-default'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    $scope.postIt.$add({
                        title: $scope.anntitle,
                        official_announcement: $scope.announcement,
                        date: date_time.toString().slice(0, 24)
                    });
                    location.reload();

                }
                if (result === false) {
                    $('#addAnn').modal('hide');
                    $scope.anntitle = "";
                    $scope.announcement = "";

                }
            }
        })
    }

    $scope.removeann = function (x) {
        var ref = firebase.database().ref('official_announcements/' + x);

        bootbox.confirm({
            message: "You are about to delete this announcement, do you wish to continue?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-default'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    ref.remove();
                }
            }
        });

    }
}]);



app.controller("showAnn", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    var ref = firebase.database().ref();

    "use strict";
    $scope.official_announcements = $firebaseArray(ref.child('official_announcements'));

    $scope.update = function (id) {
        $scope.indexValue = $scope.official_announcements.findIndex(official_announcements => official_announcements.$id === id);
    };




    $scope.saveAnn = function () {
        bootbox.confirm({
            message: "Would you like to save changes ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-basic'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    $scope.official_announcements.$save($scope.indexValue).then(function (data) {});
                    $('#editAnnModal').modal('hide');
                    location.reload();
                } else {
                    $('#editAnnModal').modal('hide');
                }
            }
        });

    }
}]);



app.controller("showfeedback", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    "use strict";
    var ref = firebase.database().ref();
    $scope.feedback = $firebaseArray(ref.child('feedback'));
    $scope.updatefeed = function (id) {
        $scope.indexValue = $scope.feedback.findIndex(feedback => feedback.$id === id);
    };
    $scope.sts = function (x) {
        $scope.feedback[$scope.indexValue].Status = x;
        $scope.feedback.$save($scope.indexValue).then(function (data) {});
        if (x === 'Reviewed') {
            
            bootbox.alert({
                message: "You have changed the status to Reviewed, you can change it later to resolved if you have responded to the user.",
                buttons: {
                    ok: {
                        label: 'OK',
                        className: 'btn btn-basic'
                    }
                },
                callback: function (result) {}
            });
        }
        if (x === 'Resolved') {
            bootbox.alert({
                message: "You have changed the feedback status to resolved, please note that the user can view their status from the feedback page.",
                buttons: {
                    ok: {
                        label: 'OK',
                        className: 'btn btn-basic'
                    }
                },
                callback: function (result) {}
            });

        }

        if (x === 'Pending') {
            bootbox.alert({
                message: "You have changed the feedback status to the default status which is pending, you can choose either resolve or review depending on the actions taken.",
                buttons: {
                    ok: {
                        label: 'OK',
                        className: 'btn btn-basic'
                    }
                },
                callback: function (result) {}
            });

        }
    }

    ref.child("feedback").on("value", function (y) {
        $scope.total = y.numChildren();
    })


    $scope.removefeedback = function (x) {
        var ref = firebase.database().ref('feedback/' + x);
        bootbox.confirm({
            message: "You are about to delete this feedback permanently, do you wish to continue?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn btn-default'
                },
                cancel: {
                    label: 'No',
                    className: 'btn btn-basic'
                }
            },
            callback: function (result) {
                if (result === true) {
                    ref.remove();
                }
            }
        });
    };



}]);



app.controller("checkfeed", ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
    $scope.infoexist = false;
    $scope.feed = "";
    $scope.feedid = '';
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
                $scope.infoexist = true;
                $scope.feed = "Your Feedback Details Are:";
                break;
            } else {
                $scope.infoexist = false;
                $scope.feed = "Error: We Could Not Find Your Information,Please Ensure That You Are Using The Correct Email Address Otherwise, Contact The Website Administrator."
            }
        }
    };
}]);
