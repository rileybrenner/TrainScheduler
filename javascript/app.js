$(document).ready(function(){

    // firebase api keys

    var config = {
        apiKey: "AIzaSyDAgHSc9SunE-z45335-S-lF5zBv3bk9k0",
        authDomain: "trainscheduler-hw-869ea.firebaseapp.com",
        databaseURL: "https://trainscheduler-hw-869ea.firebaseio.com",
        projectId: "trainscheduler-hw-869ea",
        storageBucket: "trainscheduler-hw-869ea.appspot.com",
        messagingSenderId: "876798661723",
        appId: "1:876798661723:web:037e46e46d71475a3c1b7e"
      };
      // Initialize Firebase
      firebase.initializeApp(config);

    // firebase database variable
    var database = firebase.database();

    // on click event variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        // Storing and retrieving new train data
        name = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#firstTrain").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing train data to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minutesAway;
        // Change year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Calculating the difference between the current and firstTrain
        var timeDifference = moment().diff(moment(firstTrainNew), "minutes");
        var timeRemainder = timeDifference % childSnapshot.val().frequency;
        // Calculating the minutes until next train
        var minutesAway = childSnapshot.val().frequency - timeRemainder;
        // Calculating the Next train time
        var nextTrain = moment().add(minutesAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minutesAway + "</td></tr>");

            // Error handler
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect update info
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});
