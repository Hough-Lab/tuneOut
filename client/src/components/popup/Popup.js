/* global chrome*/

import React, { useState, useEffect } from 'react';
import Styles from './Popup.css';
import { captureTab, sendHistory } from '../../index-js/index-background.js';
import GetIdButton from './components/GetIdButton.js';
import Tuneoutlogo from '../../../../icons/Tuneoutlogo.svg';
import SelectTab from './components/SelectTab.js'
import ResponseBox from './components/ResponseBox.js'
import Lottie from 'react-lottie';
import animationData from './animations/loading-animation.json'

let executed = false;

export default function Popup() {

  const [songInfo, setSongInfo] = useState([]);
  const [tabList, setTabs] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [animation, setAnimation] = useState(false)


  console.log('rendering')

  const loadHistory = () => {
      chrome.storage.sync.get(['previousRequest'], function(result) {
        console.log('previousRequest currently is ' + result.previousRequest);
        console.log('setting to previous request');
        setSongInfo(result.previousRequest);
      })
    }

  useEffect(() => {
    loadHistory();
  },[])


  const runLoadingAnimation = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false)
    }, 9000)
  }

  const listAllTabs = async () => {
    const response =  await chrome.tabs.query({audible: true}, function(tabs) {
      return tabs;
    });
    setTabs(response)
  };

  const getId = async (tabId) => {
    setAnimation(true);
    const response = await captureTab(tabId)
    console.log('response 1;', response)
    if (response.length < 30) {
      console.log('response2', response)
      setAnimation(false);
      setErrorMessage(response);
      setSongInfo([]);
      return;
    } else {
      JSON.parse(response);
      setAnimation(false);
      setSongInfo(response);
      if (JSON.parse(response).status.code === 0) {
        chrome.storage.sync.set({previousRequest: response}, function() {
        console.log('previousRequest is set to ' + response);
        });
      };
      console.log(songInfo);
    };
  };

  if (songInfo.length) {
    return (
      <div className={Styles.mainContainer}>
        <div className={Styles.logoContainer}>
          <img className={Styles.tuneoutlogo} src={Tuneoutlogo} alt='tuneOut logo' />
        </div>
        <div className={Styles.container}>
            <SelectTab></SelectTab>
            <ResponseBox runLoadingAnimation={runLoadingAnimation} animation={animation} songInfo={songInfo}></ResponseBox>
        </div>
        <div className={Styles.buttonContainer}>
            <GetIdButton className={Styles.idBtn} getId={getId}></GetIdButton>
        </div>
      </div>
    )
  } return (
    <div className={Styles.mainContainer}>
    <div className={Styles.logoContainer}>
      <img className={Styles.tuneoutlogo} src={Tuneoutlogo} alt='tuneOut logo' />
    </div>
    <div className={Styles.container}>
        <SelectTab></SelectTab>
        <ResponseBox runLoadingAnimation={runLoadingAnimation} animation={animation} errorMessage={errorMessage}></ResponseBox>
    </div>
    <div className={Styles.buttonContainer}>
        <GetIdButton className={Styles.idBtn} getId={getId}></GetIdButton>
    </div>
  </div>
  )
}

