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
        // Log the queryURL
        savedCities.push(currentCity);
        console.log(currentCity);
        localStorage.setItem('Searched Cities', savedCities);

        addCityButton()
        // Transfer content to HTML
        var tempF = (response.main.temp - 273.15) * 1.8 + 32;

        // var uvI = res.value;
        $(".city").html("<h2>" + response.name + " Weather Details</h2>");
        $(".date").append(currentDate);
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".tempF").text("Temperature: " + tempF.toFixed(2) + " F");

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        
        var queryURL2 =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&appid=" +
          APIKey;

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
        });
      });
  }

  //   create event listener for search button & call weatherGenerate function
  $("#submit-btn").on("click", function (event) {
    // If I didn't have these empty settings, they would just stack. Not sure why they would, but others wouldn't?
    $(".uvi").empty();
    $(".date").empty();
    event.preventDefault();
    weatherGenerate();
  });

  function addCityButton() {
    $(".searchedCityList").empty();

    for (var i = 0; i < savedCities.length; i++) {
      var newCity = $("<button>").text(savedCities[i]);
      $(".searchedCityList").append(newCity);
    }
  }
});
