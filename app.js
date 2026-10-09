const apiKey = "f2e2ecd5ae0a4b65bc1223128260710";
const baseUrl = "https://api.weatherapi.com/v1";

function btnSearchOnAction() {
    let txtUserSearchValue = document.getElementById("txtSearchId").value;
    if(txtUserSearchValue === "") {
        alert("Please enter a city name!");
        return;
    }
    fetchWeatherData(txtUserSearchValue);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherData(`${lat},${lon}`);
        }, (error) => {
            alert("Location access denied! Please allow location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// API Call එක (current වෙනුවට forecast.json පාවිච්චි කර ඇත)
function fetchWeatherData(query) {
    // දින 7ක දත්ත ඉල්ලමු (Free Tier එකේ දින 3ක් පමණක් ලැබිය හැක)
    let fetchUrl = `${baseUrl}/forecast.json?key=${apiKey}&q=${query}&days=7`;

    fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                alert(data.error.message);
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong!");
        });
}

function displayWeather(data) {
    // Welcome text එක හංගලා, Weather Card එක පෙන්වීම
    document.getElementById("welcomeText").style.display = "none";
    document.getElementById("weatherContent").style.display = "block";

    // 1. ප්‍රධාන දත්ත (Current Weather)
    let dateObj = new Date(data.location.localtime);
    let options = { weekday: 'long', hour: '2-digit', minute:'2-digit' };
    document.getElementById("dateTime").innerText = dateObj.toLocaleDateString('en-US', options);
    
    document.getElementById("mainIcon").src = "https:" + data.current.condition.icon.replace('64x64', '128x128');
    document.getElementById("mainCondition").innerText = data.current.condition.text;
    document.getElementById("mainTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("locationName").innerText = `${data.location.name}, ${data.location.country}`;

    // 2. අද දවසේ අමතර දත්ත (Sun times & Rain)
    // forecastday[0] යනු අද දිනයයි
    let todayForecast = data.forecast.forecastday[0];
    
    document.getElementById("sunrise").innerText = todayForecast.astro.sunrise;
    document.getElementById("sunset").innerText = todayForecast.astro.sunset;
    document.getElementById("rainChance").innerText = todayForecast.day.daily_chance_of_rain;
    document.getElementById("humidity").innerText = data.current.humidity;
    document.getElementById("wind").innerText = data.current.wind_kph;

    // 3. ඉදිරි දිනවල දත්ත (Forecast List)
    let forecastListContainer = document.getElementById("forecastList");
    forecastListContainer.innerHTML = ""; // කලින් තිබුණු දත්ත මකා දැමීම

    data.forecast.forecastday.forEach((dayData, index) => {
        // දවසේ නම ගැනීම (අද නම් 'Today' ලෙස පෙන්වීමට)
        let dayName = "Today";
        if (index > 0) {
            let dayDateObj = new Date(dayData.date);
            dayName = dayDateObj.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"
        }

        let iconUrl = "https:" + dayData.day.condition.icon;
        let maxTemp = Math.round(dayData.day.maxtemp_c);
        let minTemp = Math.round(dayData.day.mintemp_c);

        let forecastHTML = `
            <div class="forecast-item">
                <p>${dayName}</p>
                <img src="${iconUrl}" alt="icon">
                <h4>${maxTemp}°</h4>
                <h5>${minTemp}°</h5>
            </div>
        `;
        forecastListContainer.innerHTML += forecastHTML;
    });
}