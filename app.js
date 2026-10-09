const apiKey = "f2e2ecd5ae0a4b65bc1223128260710";
// අනිවාර්යයෙන්ම https පාවිච්චි කරන්න
const baseUrl = "https://api.weatherapi.com/v1"; 

// 1. City එකක් Search කිරීම
function btnSearchOnAction() {
    let txtUserSearchValue = document.getElementById("txtSearchId").value;
    
    if(txtUserSearchValue === "") {
        alert("Please enter a city name!");
        return;
    }

    fetch(`${baseUrl}/current.json?key=${apiKey}&q=${txtUserSearchValue}`)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                alert(data.error.message);
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Something went wrong!");
        });
}

// 2. User ගේ Location එක ගැනීම
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            
            fetch(`${baseUrl}/current.json?key=${apiKey}&q=${lat},${lon}`)
                .then(res => res.json())
                .then(data => {
                    if(data.error) {
                        alert(data.error.message);
                    } else {
                        displayWeather(data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("Something went wrong!");
                });
        }, (error) => {
            alert("Location access denied! Please allow location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// 3. UI එකට දත්ත ඇතුළත් කිරීම (අලුත් Glassmorphism පෙනුමට අදාළව)
function displayWeather(data) {
    let contentSection = document.getElementById("contentSection");

    // Weather API එකෙන් එන icon url එක //cdn... විදියට එන නිසා මුලට https: එකතු කිරීම
    let iconUrl = "https:" + data.current.condition.icon.replace('64x64', '128x128');

    contentSection.innerHTML = `
        <h2>${data.location.name}</h2>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px;">${data.location.country}</p>
        
        <img src="${iconUrl}" alt="weather icon">
        
        <div class="temp">${data.current.temp_c}°</div>
        <p style="font-size: 20px; font-weight: 400; margin-bottom: 10px;">${data.current.condition.text}</p>
        
        <div class="weather-details">
            <div class="detail-item">
                <p>Humidity</p>
                <h3>${data.current.humidity}%</h3>
            </div>
            <div class="detail-item">
                <p>Wind</p>
                <h3>${data.current.wind_kph} km/h</h3>
            </div>
        </div>
    `;
}