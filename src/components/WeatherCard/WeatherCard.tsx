import React, {useEffect, useState} from 'react'
import "./WeatherCard.css"

// Material UI Components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'

// Api
import {getWeatherIconSrc, fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale} from '../../utils/api'

const WeatherCardContainer: React.FC<{children: React.ReactNode, onDelete?: () => void}> = ({children, onDelete}) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && <Button onClick={onDelete}>
            <Typography className="weatherCard-body">Delete</Typography>  
          </Button>}
        </CardActions>
      </Card>
    </Box>
  )
}

type WeatherCardState = "loading" | "error" | "ready"

const WeatherCard: React.FC<{city: string, tempScale: OpenWeatherTempScale, onDelete?: () => void}> = ({city, onDelete, tempScale}) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null)
  const [cardState, setCardState] = useState<WeatherCardState>("loading")

  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then((data) => {
        setWeatherData(data)
        setCardState("ready")
      })
      .catch((err) => setCardState("error"))
  }, [city, tempScale])

  if(cardState == "loading" || cardState == "error") {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCard-title">{city}</Typography> 
        <Typography className="weatherCard-body">
          {cardState == "loading" ? "Loading..." : "Error: could not retrieve weather data for this city"}
        </Typography>
      </WeatherCardContainer>
    )
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography className="weatherCard-title">{weatherData.name}</Typography>
          <Typography className="weatherCard-temp">{Math.round(weatherData.main.temp)}</Typography>
          <Typography className="weatherCard-body">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
          <Typography className="weatherCard-body">Max: {Math.round(weatherData.main.temp_max)} || Min: {Math.round(weatherData.main.temp_min)}</Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && (
            <>
              <img src={getWeatherIconSrc(weatherData.weather[0].icon)}/>
              <Typography className="weatherCard-body">{weatherData.weather[0].main}</Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer> 
  )
}

export default WeatherCard