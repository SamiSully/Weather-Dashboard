$(document).ready(function () {
  var savedCities = [];
  function weatherGenerate() {
    // This is our API key
    var APIKey = "166a433c57516f51dfab1f7edaed8413";
    // var currentCity = "Seattle";
    var currentCity = $("#currentCity").val();
    // Here we are building the URL we need to query the database
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      currentCity +
      "&appid=" +
      APIKey;
    var currentDate = moment().format("dddd, DD MMMM");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
        savedCities.push(currentCity);
        console.log(currentCity);
        localStorage.setItem("Searched Cities", savedCities);
        // runs the function that adds the city button
        addCityButton();
        // This converts thr weather to F
        var tempF = (response.main.temp - 273.15) * 1.8 + 32;

        // the variables that display on the page!
        $(".city").html("<h2>" + response.name + " Weather Details</h2>");
        $(".date").append(currentDate);
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".tempF").text("Temperature: " + tempF.toFixed(2) + " F");
        // the latitude and longitude variables pulled from the first query URL
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        // the query url to gether the info needed to generate the UV index
        var queryURL2 =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&appid=" +
          APIKey;
        // The data pull to calculate the UV index!
        $.ajax({
          url: queryURL2,
          method: "GET",
        }).then(function (response) {
          console.log(queryURL2);
          console.log(response);
          var currentUVI = $("<span>").text("UVI: ");
          var currentUVINumber = $("<span>").text(response.current.uvi);
          $(".uvi").append(currentUVI, currentUVINumber);
          if (response.current.uvi < 3) {
            currentUVINumber.addClass("uv-green");
          } else if (response.current.uvi >= 3 && response.current.uvi < 6) {
            currentUVINumber.addClass("uv-yellow");
          } else if (response.current.uvi >= 6 && response.current.uvi < 8) {
            currentUVINumber.addClass("uv-orange");
          } else if (response.current.uvi >= 8 && response.current.uvi < 10) {
            currentUVINumber.addClass("uv-red");
          } else if (response.current.uvi >= 10) {
            currentUVINumber.addClass("uv-violet");
          }
// This is the loop that will create the 5 day forcast! Had to get a lot of help from classmates to figure out how to loop this correctly.
// Need to come back and study this section to understand it better
          for (i = 1; i < 6; i++) {
            // Takes moment.js and calculates the correct dates for each section
            var currentDate= moment().add(i, 'days').format("L")
            // pulls the data for weather using i for each day to pull the correct info
            var weather = response.daily[i].weather[0].main;
            // pulls the data for the temp using i for each day to pull the correct info
            var temp = response.daily[i].temp.day
            // converts the temp to F
            F = (temp - 273.15) * 1.80 + 32;
            F = Math.floor(F);
            // gets the humidity for each day using i
            var humidity = response.daily[i].humidity
            // these take the variables and place the correct classes that go with them.
            var dateInfo = ($("<h4>").attr("class", "pt-2")).text(currentDate);
            var weatherInfo = $("<p>").text(weather)
            var tempInfo = $("<p>").text("temp: " + F + "F")
            var humidInfo =$("<p>").text("humidity: " + humidity)
            // adds all of the variables and combines it into one so it can be appended to the page
            var fiveDayRow = $("<div>").attr("class", "sm-col-2 oneDayForecast").append(dateInfo, weatherInfo, tempInfo, humidInfo);
            // appends the variables to the page
            $(".forcastBox").append(fiveDayRow);
        }
        });
      });
  }
  //  creates an event listener to generate the weather for the entered city
  $("#searchButton").on("click", function (event) {
    // If I didn't have these empty settings, they would just stack. Not sure why they would, but others wouldn't?
   
    $(".uvi").empty();
    $(".date").empty();
    $(".forcastBox").empty();
     selectedCity = $(".currentCity").val();
    event.preventDefault();
    weatherGenerate();
  });
  // the event listener for the previous searched buttons
  $(".searchedCityList").on("click", function (event) {
    event.preventDefault();
    // weatherGenerate(savedCities[i]);
    $(".uvi").empty();
    $(".date").empty();
    $("#currentCity").empty();
    $(".forcastBox").empty();
    weatherGenerate();
  });
  // Adds the buttons from local storage onto the page!
  function addCityButton() {
    $(".list-group").empty();
    // The loop that will add a new button every time
    // need to figure out how to get links to work on buttons??
      for (var i = 0; i < savedCities.length; i++) {
        var newCity = $("<button>").text(savedCities[i]);
        newCity.addClass("list-group-item");
        $(".list-group").prepend(newCity);
    }
  }
});
// Page still has issues with populating buttons that WORK. I dont know how to fix it yet. ):
// This feels like one of my messiest codes, so I definitely want to come back and fix it.