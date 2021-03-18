/* global chrome*/
import React from 'react'
import Styles from './GetIdButton.css'
import ResponseBox from './ResponseBox.js'
// import identifyAudio from '../../../Arc-api/audio-request.js'

export default function GetIdButton({ listAllTabs, getId, setSongInfo }) {



const handleClick = (e) => {
  e.preventDefault();
  getId();
}

  return (
    <div>
        <button className={Styles.button} onClick={handleClick}>identify</button>
    </div>
  )
}
