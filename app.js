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
    // video සහ Overlay එක සඟවා Wallpaper එක පෙන්වීම
    // const bgVideo = document.getElementById("bgVideo");
    // const videoOverlay = document.getElementById("videoOverlay");
    // if (bgVideo) bgVideo.style.display = "none";
    // if (videoOverlay) videoOverlay.style.display = "none";



    // Welcome text එක අයින් කර Weather Card එක පෙන්වීම
    document.getElementById("welcomeText").style.display = "none";
    document.getElementById("weatherContent").style.display = "block";

    // Weather එක අනුව Background Video එක change කිරීම
    updateBackground(data.current.condition.text);    

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

// Weather condition එක අනුව Background Wallpaper Change කරන Function එක
function updateBackground(conditionText) {
    let text = conditionText.toLowerCase();
    
    // // Default img (නොදන්නා තත්ත්වයක් ආවොත් පෙන්වීමට)
    // let bgUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop"; 

    // Default වීඩියෝව (නොදන්නා තත්ත්වයක් ආවොත් පෙන්වීමට Welcome screen එකේ video එකම දෙන්න)
    let videoUrl = "vid/2.mp4"; // Default video

    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
        // Rain 
        videoUrl = "vid/rain.mp4"; 
    } else if (text.includes("cloud") || text.includes("overcast")) {
        // Cloudy  
        videoUrl = "vid/cloudy.mp4"; 
    } else if (text.includes("thunder") || text.includes("storm")) {
        // Thunder  
        videoUrl = "vid/thunder.mp4"; 
    } else if (text.includes("sunny") || text.includes("clear")) {
        // Clear / Normal 
        videoUrl = "vid/sunny.mp4"; 
    } else if (text.includes("snow") || text.includes("ice") || text.includes("blizzard")) {
        // Snow  
        videoUrl = "vid/snow.mp4";
    } else if (text.includes("mist") || text.includes("fog") || text.includes("smoky haze")) {
        // Mist 
        videoUrl = "vid/mist.mp4";
    }
    

    // අලුත් Wallpaper එක මාරු කිරීම
    // document.body.style.background = `linear-gradient(rgba(6, 20, 27, 0.5), rgba(6, 20, 27, 0.7)), url('${bgUrl}') no-repeat center center fixed`;
    // document.body.style.backgroundSize = "cover";

    const bgVideo = document.getElementById("bgVideo");

    // අලුත් Video එක මාරු කිරීම (එකම වීඩියෝව නැවත නැවත load වීම වැලැක්වීමට)
    if (!bgVideo.src.endsWith(videoUrl)) {
        bgVideo.src = videoUrl;
        bgVideo.load();
        bgVideo.play();
    }
}