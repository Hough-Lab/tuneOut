import React, { useState } from 'react'
import ResponseItem from './ResponseItem.js'
import Styles from './ResponseBox.css'
import Lottie from 'react-lottie';
import animationData from '../animations/loading-animation.json'
import YtSearch from './external-links/YtSearch.js'
import SpotifySearch from './external-links/SpotifySearch.js'
import DiscogsSearch from './external-links/DiscogsSearch.js'

export default function ResponseBox({ songInfo, setSongInfo, animation }) {


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  if (animation === true) {
    return (
      <div className={Styles.animation}>
        <Lottie
          options={defaultOptions}
          height={260}
          width={275}
          />
    </div>
    )
  }

  if (songInfo) {

    const songObj = JSON.parse(songInfo)
    if (songObj.status.code === 1001) {
      //? on song identification failure
      songInfo = [];
      return (
        <div className={Styles.errorBox}>
          <h3 className={Styles.errorMessage}>couldn't identify track</h3>
          <h3 className={Styles.errorMessage}>please try again</h3>
        </div>
      )
    } else if (songObj.status.code === 2004) {
      //? on song fingerprint failure
      songInfo = [];
      return (
        <div className={Styles.errorBox}>
          <h3 className={Styles.errorMessage}>couldn't detect audio</h3>
          <h3 className={Styles.errorMessage}>please try again</h3>
        </div>
      )
    }

    const id = songObj.metadata.music[0]
    const title = id.title
    const artist = id.artists[0].name
    const label = id.label
    const released = id.release_date
    const album = id.album.name

    const trackId = 'Track ID: '
    const trackArtist = 'Artist: '
    const trackReleased = 'Released: '
    const trackAlbum = 'Album: '
    const trackLabel = 'Label: '

    let externalIdSpotify;
    let externalIdYoutube;

    if (id.external_metadata.spotify) {
        externalIdSpotify = id.external_metadata.spotify.track.id
    }

    if (id.external_metadata.youtube) {
        externalIdYoutube = id.external_metadata.youtube.vid
    }

    //? on song identification successful
    return (
      <div className={Styles.resBox}>
        <ResponseItem attribute={trackId} item={title}></ResponseItem>
        <ResponseItem attribute={trackArtist} item={artist}></ResponseItem>
        <ResponseItem attribute={trackReleased} item={released}></ResponseItem>
        <ResponseItem attribute={trackAlbum} item={album}></ResponseItem>
        <ResponseItem attribute={trackLabel} item={label}></ResponseItem>
        <div className={Styles.linkbox}>
          <YtSearch className={Styles.yt} externalIdYoutube={externalIdYoutube} title={title} artist={artist}></YtSearch>
          <SpotifySearch className={Styles.spotify} externalIdSpotify={externalIdSpotify} title={title} artist={artist} ></SpotifySearch>
          <DiscogsSearch artist={artist} album={album}></DiscogsSearch>
        </div>
      </div>
    )
  }

  //? On popup initialization
  const firstMsg = 'navigate to an audible tab'
  const secondMsg = 'click identify to start'

  return (
    <div className={Styles.emptyResBox}>
      <ResponseItem attribute={firstMsg}></ResponseItem>
      <ResponseItem attribute={secondMsg}></ResponseItem>
    </div>
  )
}
