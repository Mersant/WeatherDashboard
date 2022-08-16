// citySearchHistory is a clone of the value in localStorage, if it exists, and is an array containing all of the past cities the user searched for the weather in. Its values are displayed on the left sidebar so the user can quickly select cities to search for.
var citySearchHistory = []
if(!localStorage.getItem("citySearchHistory")) {
    citySearchHistory = ["Portland", "Dayton", "Columbus", "New York", "San Diego"];
    localStorage.setItem("citySearchHistory", JSON.stringify(citySearchHistory));
} else {
    citySearchHistory = JSON.parse(localStorage.citySearchHistory);
}
function updateLi() {
    var listItems = $("#citySearchList li");
    listItems.each(function(i, li) {
        $(li).text(citySearchHistory[i]);
        $(li).on("click", function() {
            $("#citySelect").val(citySearchHistory[i])
            updateForecasts();
        })
    });
}
updateLi();


$("#searchCity").on("click", function() {
    if($("#citySelect").val() != "") {
        // Update city search list, then update the weather forecasts.
        citySearchHistory.unshift($("#citySelect").val());
        citySearchHistory.length = 5; // Prevent history from ballooning as time goes on
        localStorage.setItem("citySearchHistory", JSON.stringify(citySearchHistory));
        updateLi();
        updateForecasts();
    }
    else {
        alert("Invalid city name!");
    }
});

// This function updates today's forecasts as well as the 5-day forecast.
function updateForecasts() {
    if($("#citySelect").val() != "") {
        $.ajax({
            type: "POST",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + $("#citySelect").val() + "&exclude=hourly,daily&appid=2f5b5012d822c727f2a2149316cd61c6&units=imperial&cnt=6",
            dataType: "json",
            success: function (result, status, xhr) {
                // Reset the header in today's forecast so it contains the city name and today's date
                var now = moment();
                $("#cityNameDate").text( $("#citySelect").val() + ", Today (" + now.format('MMMM Do YYYY') + ")" );
                $("#cityTemp").text(result["list"][0]["main"]["temp"]);
                $("#cityWind").text(result["list"][0]["wind"]["speed"]);
                $("#cityHumidity").text(result["list"][0]["main"]["humidity"]);
                updateUVI( result["city"]["coord"]["lat"], result["city"]["coord"]["lon"] );

                // Now update the daily forecast
                for(var i=1; i<= 5; i++) { // i starts at 1 since 0th element is today
                    $("#day" + i + "Temp").text(result["list"][i]["main"]["temp"]);
                    $("#day" + i + "Wind").text(result["list"][i]["wind"]["speed"]);
                    $("#day" + i + "Humidity").text(result["list"][i]["main"]["humidity"]);
                }

            },
            error: function (xhr, status, error) {
                alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + ". Please retype the name of the city")
            }
        });
    }
}
updateForecasts();

// Make seperate API call to update UVI
function updateUVI(lat, lon) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=26e3aa97bcb7fc4beeb5e26c3594baf4&units=metric",
        dataType: "json",
        success: function (result, status, xhr) {
            $("#cityUVIndex").text(result["value"]);
            // Color code the UV index in terms of how dangerous it is
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
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    })
}
