// Initialize Firebase (YOUR OWN APP)
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)
var firebaseConfig = {
    apiKey: "AIzaSyD9b8dMN3qaV9qyr26jN0wQeIFEZTk1uvA",
    authDomain: "in-class-trilogy-project.firebaseapp.com",
    databaseURL: "https://in-class-trilogy-project.firebaseio.com",
    projectId: "in-class-trilogy-project",
    storageBucket: "in-class-trilogy-project.appspot.com",
    messagingSenderId: "167778443868",
    appId: "1:167778443868:web:cb83bdc003000243"

};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
// var database = ...
var database = firebase.database();
//==========================================

// Moved out of onclick function so that it'll automatically populate the page with information
database.ref().on("child_added", function (childSnap) {
    var trainName = childSnap.val().trainNames;
    var trainDest = childSnap.val().trainDestinations;
    var trainStart = childSnap.val().trainStarts;
    var tFrequency = childSnap.val().trainFrequency;
    var next = childSnap.val().next;
    var min = childSnap.val().min;

    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + tFrequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

$("#add-train").on("click", function () {
    var trainName = $("#newName").val().trim();
    var trainDest = $("#newDest").val().trim();
    var trainStart = $("#newStart").val().trim();
    var tFrequency = $("#newFrequency").val().trim();

    // helps prevent empty answer boxes, because... users...
    if (trainName == "") {
        alert("Please enter a valid Train Name");
        return false;
    }
    if (trainDest == "") {
        alert("Please enter a valid Destination");
        return false;
    }
    if (trainStart == "") {
        alert("Please enter a valid initial start");
        return false;
    }
    if (tFrequency == "") {
        alert("Please enter a valid frequency");
        return false;
    }

    // Conversion for time:
    var firstTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    var currentTime = moment();
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % tFrequency;
    // console.log("Remainder: " + tRemainder);

    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("Minutes till Train: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));


    // Push all information in a var
    var newTrain = {
        //server:local
        trainNames: trainName,
        trainDestinations: trainDest,
        trainStarts: trainStart,
        trainFrequency: tFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        min: tMinutesTillTrain,

        // next: nextTrain
    }
    console.log(newTrain);
    database.ref().push(newTrain);

    // Clear out Input space
    $("#newName").val("");
    $("#newDest").val("");
    $("#newStart").val("");
    $("#newFrequency").val("");
});