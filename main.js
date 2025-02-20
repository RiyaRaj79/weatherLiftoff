const apiKey = "02605163f98a04a1e294b849d81444e6"; // Your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");

async function checkWeather(city) {
    try {
        // Hide weather info while loading
        weatherDiv.style.display = "none";
        
        // Construct the URL with proper encoding
        const encodedCity = encodeURIComponent(city);
        const fullUrl = `${apiUrl}${encodedCity}&appid=${apiKey}`; // Corrected the template literal
        
        const response = await fetch(fullUrl);
        
        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found! Please check the city name.");
            } else if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key.");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`); // Corrected the string interpolation
            }
        }

        const data = await response.json();
        
        // Update UI only if we have valid data
        if (data && data.main) {
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            // Update weather icon based on weather condition
            const weatherMain = data.weather[0].main.toLowerCase();
            let iconUrl = "https://raw.githubusercontent.com/Aakrut/weather-app/master/images/";
            
            switch(weatherMain) {
                case "clouds":
                    iconUrl += "clouds.png";
                    break;
                case "clear":
                    iconUrl += "clear.png";
                    break;
                case "rain":
                    iconUrl += "rain.png";
                    break;
                case "drizzle":
                    iconUrl += "drizzle.png";
                    break;
                case "mist":
                    iconUrl += "mist.png";
                    break;
                default:
                    iconUrl += "clouds.png";
            }
            
            weatherIcon.src = iconUrl;
            weatherDiv.style.display = "block";
        } else {
            throw new Error("Invalid data received from the API");
        }
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message || "Error fetching weather data. Please try again.");
        weatherDiv.style.display = "none";
    }
}
// Event listener for search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city === "") {
        alert("Please enter a city name");
        return;
    }
    checkWeather(city);
});

// Event listener for Enter key
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = searchBox.value.trim();
        if (city === "") {
            alert("Please enter a city name");
            return;
        }
        checkWeather(city);
    }
});

// Initial weather check for New York
window.addEventListener('DOMContentLoaded', () => {
    checkWeather("New York");
});
