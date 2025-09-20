
# Weather Dashboard

## Overview

The **Weather Dashboard** is a responsive web application that provides real-time weather information based on the user's location or a manually entered city. It displays crucial weather data, including temperature, humidity, wind speed, and a 5-day weather forecast, fetched from the **OpenWeatherMap API**.

## Features

- **Real-time weather data**: Current weather including temperature, humidity, wind speed.
- **5-day weather forecast**: Displays weather predictions for the next 5 days.
- **Location-based data**: Automatically fetches weather for the user's location using the browser's Geolocation API.
- **City search**: Users can enter any city name to get its weather data.
- **Responsive UI**: Designed to be mobile-friendly with a simple and clean layout.

## Technologies Used

- **HTML5** – For structuring the web pages.
- **CSS3** – For styling the application, including responsive design.
- **JavaScript** – For handling API requests and dynamic content updates.
- **OpenWeatherMap API** – For fetching weather data based on city or location.

## API Integration

This app integrates with the **OpenWeatherMap API** to retrieve weather data. You need an API key to use it.

To get your own API key:
1. Visit [OpenWeatherMap](https://openweathermap.org/).
2. Sign up for an account.
3. Obtain an API key from the API section of your account.

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AmaedaQ/weather-dashboard.git
   cd weather-dashboard
   ```

2. Open the `index.html` file in your preferred browser to view the app.

3. Optionally, you can deploy the app using any static site hosting service like GitHub Pages or Netlify.

## How to Use

1. **Automatic location-based weather**: When you open the app, it will fetch the weather for your current location using the browser's geolocation API (if granted).
   
2. **Search by city**: Type a city name in the search bar and press enter to view the weather details for that city.

3. **View the forecast**: The app also shows a 5-day forecast so that users can plan ahead.


## Roadmap

- **Dark mode**: Adding dark mode support for better accessibility.
- **Additional weather details**: Including more detailed information such as pressure, visibility, and UV index.
- **Mobile app version**: Future plans to create a mobile app using React Native or similar frameworks.



## Acknowledgements

- **OpenWeatherMap API**: For providing the weather data.
- **Geolocation API**: For fetching user location in real-time.
- **Bootstrap**: For responsive front-end development (if you choose to use it).
```

