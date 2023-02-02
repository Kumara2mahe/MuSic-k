// ----------------------- Playback (Seek, Loop, Play) | Script ------------------------- //

import { getStyle, toTimeStamp, shuffle } from "./helper.js"

const musicPlayer = document.querySelector(".music-player")
const playButton = musicPlayer.querySelector(".control-btns .play-btn")
const loopButton = musicPlayer.querySelector(".control-btns .loop-btn")
const LOOPS = ["single", "infinite", "shuffle"]
const PLAYBACK = ["resume", "pause"]


// Song Playlist
var PLAYLIST = {
    playing: null,
    songs: []
}

// Make Element Visible
export const makeVisible = (element) => {
    element.classList.replace("invisible", "visible")
}

// ----- Playback Initiator | Scripts ---- //
export const setupPlayback = (audio) => {

    // Initiate playback
    playButton.addEventListener("click", () => {
        instantPlayback(audio)
        audio.loop = loopButton.classList[2] == LOOPS[0]
    })

    // Set Loop Mode
    loopButton.addEventListener("click", () => {
        audio.loop = false
        toggleLoop(audio)
    })

    // Dark Mode
    musicPlayer.querySelector(".dark-mode-btn").addEventListener("click", switchDarkMode)
}

// Choose/Resume/Pause music Playback
const instantPlayback = (audio) => {
    if (audio.currentSrc == "") {
        let input = document.createElement("input")
        Object.assign(input, { type: "file", accept: "audio/*", multiple: true })
        input.click()
        input.addEventListener("change", () => {
            let songs = input.files
            if (songs.length >= MAXSONGS) {
                alert(`Too much songs selected, you can only select maximum of ${MAXSONGS}`)
            }
            else {
                PLAYLIST.songs = [...songs]
                loadSong(audio, 0)
                activeSkipSong(audio)
            }
        })
        input.remove()
    }
    else if (playButton.classList.contains(PLAYBACK[0])) {
        playSong(audio)
    }
    else pauseSong(audio)
}
const MAXSONGS = 20

// Load Song
const loadSong = (audio, songnumber) => {
    let song = PLAYLIST.songs[songnumber]
    audio.src = URL.createObjectURL(song)
    audio.onplay = () => {
        URL.revokeObjectURL(audio.src)
        audio.onplay = null
    }
    jsmediatags.read(song, {
        onSuccess: getMetadata,
        onError: (error) => { console.log(error) }
    })
    PLAYLIST.playing = songnumber
    playSong(audio)
}
const jsmediatags = window.jsmediatags

// Get Song Metadata
const getMetadata = (data) => {
    let tags = data.tags, sCoverURL = "url('./Assets/Images/thumb.png')",
        sTitle = "Unknown Track"

    if (tags.hasOwnProperty("picture")) {
        let arrayBuffer = tags.picture.data, format = tags.picture.format,
            base64String = arrayBuffer.reduce((data, byte) => {
                return data + String.fromCharCode(byte);
            }, "");
        sCoverURL = `url(data:${format};base64,${window.btoa(base64String)})`
    }
    // Showing Cover
    document.body.style.backgroundImage = audioCover.style.backgroundImage = sCoverURL

    if (tags.hasOwnProperty("title")) {
        sTitle = tags.title
    }
    audioTitle.innerHTML = sTitle
    makeVisible(audioTitle) // Showing Title

    if (tags.hasOwnProperty("artist")) {
        audioArtist.innerHTML = tags.artist
        makeVisible(audioArtist) // Showing Artist
    }
}
const audioCover = musicPlayer.querySelector(".cover-picture .thumb")
const audioTitle = musicPlayer.querySelector(".music-title")
const audioArtist = musicPlayer.querySelector(".music-artist")

// Resume Playback
const playSong = (audio) => {
    audio.play()
    playButton.classList.replace(PLAYBACK[0], PLAYBACK[1])
    musicPlayer.classList.add("play")
}

// Pause Playback
export const pauseSong = (audio) => {
    audio.pause()
    playButton.classList.replace(PLAYBACK[1], PLAYBACK[0])
    musicPlayer.classList.remove("play")
}

// Activate Skip Buttons
const activeSkipSong = (audio) => {
    nextButton.addEventListener("click", skipNext)
    prevButton.addEventListener("click", skipPrev)
    audio.addEventListener("ended", skipNext)
    audio.addEventListener("timeupdate", () => {
        let duration = isNaN(audio.duration) ? 0 : audio.duration
        let currentTime = audio.currentTime
        if (songDuration.innerHTML != duration) {
            songDuration.innerHTML = `${toTimeStamp(duration, false)}`
        }
        songCurrentTime.innerHTML = `${toTimeStamp(currentTime, false, songDuration.innerHTML.length > 5)}`

        // Moving Seek Slider
        if (makeProgress) {
            moveSeekSlider(currentTime, duration)
        }
    })
    // Change Song time in Seekbar
    timeSeekbar.addEventListener("mousedown", () => {
        musicProgress.addEventListener("mousemove", moveSeekSliderWithCursor)
        window.addEventListener("mouseup", changeSongTime)
    })
}
const nextButton = musicPlayer.querySelector(".control-btns .next-btn")
const prevButton = musicPlayer.querySelector(".control-btns .prev-btn")
const timeSeekbar = musicPlayer.querySelector(".player-controls .progress")
const seekSlider = timeSeekbar.querySelector(".slider")
const seekPointerWidth = getStyle(seekSlider, "width", "::after")
const songDuration = musicPlayer.querySelector(".durations .total")
const songCurrentTime = musicPlayer.querySelector(".durations .current")
const musicProgress = musicPlayer.querySelector(".music-progress")

// Skip to Next Song
const skipNext = () => {
    let audio = musicPlayer.querySelector("#audio-player")
    pauseSong(audio)
    if (PLAYLIST.playing >= PLAYLIST.songs.length - 1) {
        loadSong(audio, 0)
    }
    else {
        loadSong(audio, ++PLAYLIST.playing)
    }
}

// Skip to Previous Song
const skipPrev = () => {
    let audio = musicPlayer.querySelector("#audio-player")
    pauseSong(audio)
    if (PLAYLIST.playing <= 0) {
        loadSong(audio, PLAYLIST.songs.length - 1)
    }
    else {
        loadSong(audio, --PLAYLIST.playing)
    }
}

// Make seekbar progress by both visual & song time
const moveSeekSlider = (currentTime, duration) => {
    seekSlider.style.width = `${currentTime / duration * 100}%`
    const isWidthBigger = getStyle(seekSlider, "width") > seekPointerWidth
    seekSlider.style.justifyContent = isWidthBigger ? "flex-end" : "space-between"
}
var makeProgress = true
const moveSeekSliderWithCursor = (event) => {
    let cursorPos = event.layerX - Math.floor(getStyle(musicPlayer, "paddingLeft"))
    moveSeekSlider(cursorPos, getStyle(timeSeekbar, "width"))
    makeProgress = false
}
const changeSongTime = (event) => { // Play song from the new seeked time
    let audio = musicPlayer.querySelector("#audio-player")
    let newtime = event.offsetX + (seekPointerWidth / 2)
    audio.currentTime = (newtime / timeSeekbar.clientWidth) * audio.duration
    makeProgress = true
    musicProgress.removeEventListener("mousemove", moveSeekSliderWithCursor)
    window.removeEventListener("mouseup", changeSongTime)
}
// -------------- //

// Toggle Loop Mode
const toggleLoop = (audio) => {
    let currentState = loopButton.classList[2], newState,
        currentStateIndex = LOOPS.indexOf(currentState)
    if (currentStateIndex < LOOPS.length - 1) {
        newState = LOOPS[currentStateIndex + 1]
    }
    else newState = LOOPS[0]
    loopButton.classList.replace(currentState, newState)
    if (newState == LOOPS[2]) {
        PLAYLIST.songs = shuffle(PLAYLIST.songs, PLAYLIST.playing)
    }
    else if (newState == LOOPS[1]) {
        PLAYLIST.songs = PLAYLIST.songs.sort((s1, s2) => {
            let song1 = s1.name.toUpperCase()
            let song2 = s2.name.toUpperCase()
            if (song1 < song2) return -1
            else if (song1 > song2) return 1
            return 0
        })
    }
    else audio.loop = true
}

// Dark Mode
const switchDarkMode = () => {
    document.body.classList.toggle("dark-mode")
}