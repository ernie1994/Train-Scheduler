$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAc1_08OM3VZSBD8sw3LUsBXamhnGGnACk",
        authDomain: "train-scheduler-f39ed.firebaseapp.com",
        databaseURL: "https://train-scheduler-f39ed.firebaseio.com",
        projectId: "train-scheduler-f39ed",
        storageBucket: "train-scheduler-f39ed.appspot.com",
        messagingSenderId: "572227142254"
    };
    firebase.initializeApp(config);

    var db = firebase.database();

    function fillTable() {
        $("tbody").empty();

        db.ref().on("child_added", function (snap) {
            var train = snap.val();
            var tbody = $("tbody");

            var row = $("<tr>");

            ["name", "destination", "frequency"]
                .forEach((str) => {
                    var td = $("<td>");
                    td.text(train[str]);
                    row.append(td);
                });

            var first = train.first;
            var firstMom = moment(first, "hh:mm");

            var diff = moment().diff(firstMom, "minutes");

            var diffMins = train.frequency - (diff % train.frequency);


            var next = moment().add(diffMins, "minutes");
            var nextTime = next.format("hh:mm a").toUpperCase();

            [nextTime, diffMins].forEach((str) => {
                var td = $("<td>");
                td.text(str);
                row.append(td);
            })

            tbody.append(row);
        });

    }


    $("#submit").on("click", function () {
        event.preventDefault();

        var name = $("#name")
            .val()
            .trim();

        var destination = $("#destination")
            .val()
            .trim();

        var first = $("#first")
            .val()
            .trim();

        var frequency = $("#frequency")
            .val()
            .trim();

        var blank = false;

        [name, destination, first, frequency].forEach((str) => {
            if (!str) {
                blank = true;
            }
        });

        if (blank) {
            alert("Do Not Leave Any Fields Blank");
            return;
        }

        var strs = first.split(":");
        strs.forEach((str) => {
            if (str.match(/[a-z]/i) || strs.length != 2) {
                alert("Invalid Time Format");
                return;
            }
        });

        if (frequency.match(/[a-z]/i)) {
            alert("Frequency Must Be A Number");
            return;
        }

        db.ref().push({
            destination: destination,
            first: first,
            name: name,
            frequency: frequency
        });

        ["name", "destination", "first", "frequency"].forEach((str) => {
            $("#" + str).val(null);
        });

    });

    fillTable();
    setInterval(fillTable, 60000);

});