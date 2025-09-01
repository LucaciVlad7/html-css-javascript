import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port=3000;
const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY="97614975ca2e153647adfed7c5d1047d";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

async function getCoordinates(city){
    const url=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
    const response = await axios.get(url);
    if(response.data.length>0){
      const { lat, lon } = response.data[0];
      return { lat, lon };
    }else{
      throw new Error("City not found");
    }
}

app.post("/submit", async (req, res) => {
  const city_name = req.body.city;
  try {
    const coordinates = await getCoordinates(city_name);

    const url = `${API_URL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,current,alerts&appid=${API_KEY}&units=metric`;
    const result = await axios.get(url);

    const tomorrow = result.data.daily[1]; // tomorrow's weather
    const willRain = tomorrow.weather.some(w =>
      w.main.toLowerCase().includes("rain")
    );

    res.render("index.ejs", {
      content: JSON.stringify(
        {
          city: city_name,
          coordinates,
          tomorrow: {
            temp: tomorrow.temp,
            weather: tomorrow.weather,
            willRain,
          },
        },
      ),
    });
  } catch (error) {
    res.render("index.ejs", {
      content: JSON.stringify({ error: error.message }, null, 2),
    });
  }
});

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});