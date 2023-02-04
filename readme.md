
<h1 align="center">MuSic-K</h1>

<b>MuSic-K</b> is a static music player app which plays music/songs in the local machine through the browser. It includes basic options like skip songs, volume control and also seeking through a song.

<br>

### Built With

* HTML
* CSS
* JavaScript

<br>

## Instructions

1. Click the <img src="https://drive.google.com/uc?export=view&id=1G2i73vkkWG7mGx81xdGsOlKZGkzaRkKq" alt="Play icon" width="20" height="20">, which opens a file dialog.
2. Select the songs/music you want to play, once loaded it play in a order.
3. To stop playing click the <img src="https://drive.google.com/uc?export=view&id=1BJz0aEDWZDblMi9xKfdzXUIE5CN014Z0" alt="Pause icon" width="20" height="20">.

<br>

## Features

#### Switch Loop Mode

- Single Loop&ensp;<img src="https://drive.google.com/uc?export=view&id=16igg8Uek-o4QyRmhg8s2vjKXgvulsGhZ" alt="single loop" width="20" height="20">: play a single song/music repeatedly
- Infinite Loop&ensp;<img src="https://drive.google.com/uc?export=view&id=1zpbQZXE_WI_XyHBV0ZTyZi-Fs8uQbL18" alt="infinite loop" width="20" height="20">: repeatedly play selected song in alphabetical order
- Shuffle Loop&ensp;<img src="https://drive.google.com/uc?export=view&id=12HPo7K3dmQhA9rgXunoMU7IcP21QsuJf" alt="shuffle loop" width="20" height="20">: repeatedly play selected song in some random order

#### Sleep Timer

- <img src="https://drive.google.com/uc?export=view&id=1a7fEz60-Zux8acFhR7Giu7Z8dzvtYw3Q" alt="sleep timer" width="20" height="20">&ensp;User can choose a time(minutes) to stop the playback after particular time, when the choosen time reaches playback pause automatically.

#### Volume & Playback Controls

- Volume seeking: change volume by both drag or click on volume slider
- Mute&ensp;<img src="https://drive.google.com/uc?export=view&id=1bsAfDtNBdIv4kCGIe1BBDh8mQRX31btf" alt="mute" width="20" height="20">: can mute/unmute the volume by click
- Song seeking: change song time by both drag or click on the song duration progress bar

#### Dark Mode

- User can switch between dark & light mode, and it is remembered even after reload using localstorage.

#### Songs Queue&ensp;<img src="https://drive.google.com/uc?export=view&id=14oedEAsBgxN5Vmt4BH7DRDtHNXmxzPxP" alt="playlist" width="20" height="20">

- Add Song: can add more songs as in the go, like in middle of playback
- Switch Song: can now switch to the song it any order, by a single click
- Remove Song&ensp;<img src="https://drive.google.com/uc?export=view&id=1xi96Uo44GSBV6Y2L-5pBpuFsFFvNsdsh" alt="remove" width="20" height="20">: song which are added by mistakes, can be now removed by a single click

<br>

### 3rd-party Library

- [jsmediatags](https://github.com/aadsm/jsmediatags): to get the song metadata like title, artist and cover picture

  ```js
    // Sample Metadata tags used in project
    {
      title: "Track Title",
      artist: "SoundHelix",
      picture: ArrayBuffer...,
    }
  ```

<br>

## Screenshots

- <a href="https://drive.google.com/file/d/15kI-pTDGNUky8g5ifxmw1i_88nX2nBmh/view?usp=share_link" target="_blank" title="click to view on fullscreen">
    <p>Playing a song at light mode</p>
    <img src="https://drive.google.com/uc?export=view&id=1b6YQUkONcnK9fgYGFsVrKpdHvV5lDarw">
  </a>
- <a href="https://drive.google.com/file/d/1QkZEV4CynLN6pUHvpHCLN5xXbl1LLf2t/view?usp=share_link" target="_blank" title="click to view on fullscreen">
    <p>Showing Volume controls, when playing a song at dark mode</p>
    <img src="https://drive.google.com/uc?export=view&id=15VBEy1Z6IeZ5V-1ConqeqqdRgQxUIO4x">
  </a>
- <a href="https://drive.google.com/file/d/1iv7AgrSLnKF0qpfwdbC5P9YmYEFgBX4q/view?usp=share_link" target="_blank" title="click to view on fullscreen">
    <p>Showing song queue, when playing song at light mode</p>
    <img src="https://drive.google.com/uc?export=view&id=1Hife1uWVy87KPbxbj-LVp90U2iy8psLU">
  </a>

<br>

> Check Live Project at [here!](https://music-k-by-kumara.web.app)

### License
[MIT](https://choosealicense.com/licenses/mit/)
