
$("#submit").click(function (e) {
    if($("#citySelect").val() != "") {
        $.ajax({
            type: "POST",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + $("#citySelect").val() + "&exclude=hourly,daily&appid=2f5b5012d822c727f2a2149316cd61c6&units=imperial&cnt=6",
            dataType: "json",
            success: function (result, status, xhr) {
                // Reset h1 so it contains the city name and today's date
                var now = moment();
                $("#cityNameDate").text( $("#citySelect").val() + ", " + now.format('MMMM Do YYYY') );
                $("#cityTemp").text(result["list"][0]["main"]["temp"]);
                $("#cityWind").text(result["list"][0]["wind"]["speed"]);
                $("#cityHumidity").text(result["list"][0]["main"]["humidity"]);
                updateUVI( result["city"]["coord"]["lat"], result["city"]["coord"]["lon"] );
            },
            error: function (xhr, status, error) {
                alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + ". Please retype the name of the city")
            }
        });
    }
});

// Make seperate API call to update UVI
function updateUVI(lat, lon) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=26e3aa97bcb7fc4beeb5e26c3594baf4&units=metric",
        dataType: "json",
        success: function (result, status, xhr) {
            $("#cityUVIndex").text(result["value"]);
            if( result["value"] < 2 ) {
                $("#cityUVIndex").css("background-color", "green");
                $("#cityUVIndex").css("color", "white");
            }
            else if( result["value"] >= 2 && result["value"] < 5) {
                $("#cityUVIndex").css("background-color", "yellow");
                $("#cityUVIndex").css("color", "black");
            }
            else if( result["value"] >= 5 && result["value"] < 7) {
                $("#cityUVIndex").css("background-color", "orange");
                $("#cityUVIndex").css("color", "white");
            }
            else if( result["value"] >= 7 && result["value"] < 10) {
                $("#cityUVIndex").css("background-color", "red");
                $("#cityUVIndex").css("color", "white");
            }
            else {
                $("#cityUVIndex").css("background-color", "purple");
                $("#cityUVIndex").css("color", "white");
            }
            
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + ". Please retype the name of the city")
        }
    })
}
