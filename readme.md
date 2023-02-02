
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
- Song seeking: change song time by click on the song duration progress bar

#### Dark Mode

- User can switch between dark & light mode

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

> Check Live Project at [here!](https://music-k-by-kumara.web.app)

### License
[MIT](https://choosealicense.com/licenses/mit/)
