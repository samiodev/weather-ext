import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import WeatherCard from '../components/WeatherCard'
import './contentScript.css'
import {getStoredOptions, LocalStorageOptions} from '../utils/storage'
import {Message} from '../utils/message'

import Card from '@mui/material/Card'

const App:React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options)
      setIsActive(options.hasAutoOverlay)
    })
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if(msg === Message.TOGGLE_OVERLAY) {
        setIsActive(!isActive)
      }
    })
  }, [isActive])

  if(!options) {
    return null
  }

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard city={options.homeCity} tempScale={options.tempScale} onDelete={() => setIsActive(!isActive)} />
        </Card>
      )}
    </>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<App />, root)