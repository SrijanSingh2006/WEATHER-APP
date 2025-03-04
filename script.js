const API_KEY = '6741f750f2968f55a58ea76020000a2f';
const setBgImage = (condition) => {
    let bgImage = 'default.jpg';
    if (condition.includes('clear')) bgImage = 'clear.jpg';
    else if (condition.includes('clouds')) bgImage = 'cloudy.jpg';
    else if (condition.includes('rain')) bgImage = 'rainy.jpg';
    else if (condition.includes('snow')) bgImage = 'snow.jpg';
    document.body.style.backgroundImage = `url('${bgImage}')`;
};

const toggleLoader = (show) => {
    const loader = document.getElementById('loader');
    loader.classList.toggle('hidden', !show);
};

const getWeatherByCity = async () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    toggleLoader(true);
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log("City Weather Data:", data);  
        if (response.ok) {
            showWeather(data);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please try again.');
    } finally {
        toggleLoader(false);
    }
};

const getWeatherByLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            toggleLoader(true);
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                console.log("Location Weather Data:", data);
                showWeather(data);
            } catch (error) {
                console.error('Error fetching location data:', error);
            } finally {
                toggleLoader(false);
            }
        });
    }
};

const showWeather = (data) => {
    const date = new Date();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('day-name').innerText = dayName;  
    document.getElementById('location').innerText = data.name;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('temperature').innerText = `${data.main.temp}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} km/h`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    setBgImage(data.weather[0].main.toLowerCase());
    document.getElementById('weather-info').classList.remove('hidden');
};
