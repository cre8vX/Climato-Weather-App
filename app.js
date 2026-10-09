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


function fetchWeatherData(query) {
    
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
    // 0. වීඩියෝව සහ Overlay එක සඟවා Wallpaper එක පෙන්වීම
    const bgVideo = document.getElementById("bgVideo");
    const videoOverlay = document.getElementById("videoOverlay");
    if (bgVideo) bgVideo.style.display = "none";
    if (videoOverlay) videoOverlay.style.display = "none";

    // 1. Weather එක අනුව Background Wallpaper එක මාරු කිරීම
    updateBackground(data.current.condition.text);

    // Welcome text එක අයින් කර Weather Card එක පෙන්වීම
    document.getElementById("welcomeText").style.display = "none";
    document.getElementById("weatherContent").style.display = "block";

    

    // Current Weather
    let dateObj = new Date(data.location.localtime);
    let options = { weekday: 'long', hour: '2-digit', minute:'2-digit' };
    document.getElementById("dateTime").innerText = dateObj.toLocaleDateString('en-US', options);
    
    document.getElementById("mainIcon").src = "https:" + data.current.condition.icon.replace('64x64', '128x128');
    document.getElementById("mainCondition").innerText = data.current.condition.text;
    document.getElementById("mainTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("locationName").innerText = `${data.location.name}, ${data.location.country}`;

    // (Sun times & Rain)
    // forecastday[0] යනු අද දිනයයි
    let todayForecast = data.forecast.forecastday[0];
    
    document.getElementById("sunrise").innerText = todayForecast.astro.sunrise;
    document.getElementById("sunset").innerText = todayForecast.astro.sunset;
    document.getElementById("rainChance").innerText = todayForecast.day.daily_chance_of_rain;
    document.getElementById("humidity").innerText = data.current.humidity;
    document.getElementById("wind").innerText = data.current.wind_kph;

    // (Forecast List)
    let forecastListContainer = document.getElementById("forecastList");
    forecastListContainer.innerHTML = ""; 

    data.forecast.forecastday.forEach((dayData, index) => {
       
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

// Weather condition එක අනුව Background Wallpaper මාරු කරන Function එක
function updateBackground(conditionText) {
    let text = conditionText.toLowerCase();
    
    // Default රූපය (නොදන්නා තත්ත්වයක් ආවොත් පෙන්වීමට)
    let bgUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"; 

    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
        // වැස්ස 
        bgUrl = "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070&auto=format&fit=crop"; 
    } else if (text.includes("cloud") || text.includes("overcast")) {
        // වලාකුළු සහිත 
        bgUrl = "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop"; 
    } else if (text.includes("thunder") || text.includes("storm")) {
        // ගිගුරුම් සහිත 
        bgUrl = "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop"; 
    } else if (text.includes("sunny") || text.includes("clear")) {
        // පැහැදිලි / සාමාන්‍ය 
        bgUrl = "https://images.unsplash.com/photo-1601297183314-c09d33f11c75?q=80&w=2070&auto=format&fit=crop"; 
    } else if (text.includes("snow") || text.includes("ice") || text.includes("blizzard")) {
        // හිම වැටෙන 
        bgUrl = "https://images.unsplash.com/photo-1542601098-35616235beff?q=80&w=2038&auto=format&fit=crop";
    } else if (text.includes("mist") || text.includes("fog")) {
        // මීදුම සහිත
        bgUrl = "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1973&auto=format&fit=crop";
    }
    else if (text.includes("sunny") || text.includes("clear")) {
    // Sunny 
    bgUrl = "https://images.unsplash.com/photo-1601297183314-c09d33f11c75?q=80&w=2070&auto=format&fit=crop"; 
    }

    // අලුත් Wallpaper එක මාරු කිරීම
    document.body.style.background = `linear-gradient(rgba(6, 20, 27, 0.5), rgba(6, 20, 27, 0.7)), url('${bgUrl}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
}