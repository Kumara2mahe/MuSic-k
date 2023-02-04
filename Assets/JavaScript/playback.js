// ----------------------- Playback (Seek, Loop, Play) | Script ------------------------- //

import { Playlist } from "./playlist.js"
import { getStyle, toTimeStamp } from "./helper.js"


const audio = Playlist.audioElement
const musicPlayer = Playlist.musicPlayer
const loopButton = musicPlayer.querySelector(".control-btns .loop-btn")
const LOOPS = ["single", "infinite", "shuffle"]
const MAXSONGS = 300

// Song Playlist
var PLAYLIST = new Playlist()

// ----- Playback Initiator | Scripts ---- //
export const setupPlayback = () => {

    // Initiate playback
    musicPlayer.querySelector(".play-btn").addEventListener("click", instantPlayback)
    audio.addEventListener("play", Playlist.playAnimation)
    audio.addEventListener("pause", Playlist.pauseAnimation)
    Playlist.clearBlobUrl() // clear file blob url

    // Set Playlist Controls
    musicPlayer.querySelector(".extend-q .add-songs-btn").addEventListener("click", instantPlayback)
    musicPlayer.querySelector(".songs-q-btn").addEventListener("click", () => {
        musicPlayer.classList.add("show-queue")
        setTimeout(() => {
            musicPlayer.addEventListener("click", isMouseOverQueue)
        }, 100)
    })

    // Set Loop Mode
    loopButton.addEventListener("click", () => {
        audio.loop = false
        toggleLoop(audio)
    })
}

// Choose/Resume/Pause music Playback
const instantPlayback = (event) => {
    let button = event.target, totalSongs = PLAYLIST.songcount
    if (audio.src == "" || button.classList[0] == "add-songs-btn") {
        let input = document.createElement("input")
        Object.assign(input, { type: "file", accept: "audio/*", multiple: true })
        input.click()
        input.addEventListener("change", () => {
            loadAllSongs(input, totalSongs)
        })
        input.remove()
    }
    else Playlist.switchPlaybackState()
    audio.loop = loopButton.classList[2] == LOOPS[0]
}

// Load all the selected songs
const loadAllSongs = (input, totalSongs) => {
    let songs = input.files
    if (songs.length >= MAXSONGS) {
        alert(`Too much songs selected, you can only select maximum of ${MAXSONGS} at a time`)
    }
    else {
        let sIndex = 0, sLength = PLAYLIST.songcount = songs.length
        for (let song; sIndex < sLength; sIndex++) {
            jsmediatags.read(song = songs.item(sIndex), {
                onSuccess: data => PLAYLIST.getMetaData(song, data.tags),
                onError: () => {
                    alert(`No MetaData Found from - (${song.name})\nTry again with proper Audio file.`)
                    window.location.reload()
                }
            })
        }
        songDataVerifier(totalSongs)
    }
}

// Verifiy all songs are loaded
const songDataVerifier = (totalSongs) => {
    const loadingBar = document.createElement("section")
    loadingBar.classList.add("loading-bar")
    loadingBar.innerHTML = "<div class='slider'></div>"
    document.body.prepend(loadingBar)

    // Checking all the song data is loaded
    let songsCount = PLAYLIST.songcount, loader = 1
    const scanner = setInterval(() => {
        let fullyLoadedSongs = PLAYLIST.songs.slice(totalSongs).map((song) => {
            return song.title != undefined && song.metaData != undefined && song.metaData.artist != undefined && song.metaData.coverUrl != undefined
        })
        if (fullyLoadedSongs.length < songsCount) {
            loader = fullyLoadedSongs.filter((song) => { return song }).length / songsCount
        }
        else {
            // Stop checking & Sorting songs
            clearInterval(scanner)
            PLAYLIST.sort()

            // Load & Play Song
            if (totalSongs == 0) {
                PLAYLIST.loadSong(PLAYLIST.playing != null ? PLAYLIST.playing : 0)
                activeSkipSong(audio)
            }
            loadingBar.remove()
        }
        loadingBar.querySelector(".slider").style.width = `${loader * 100}%`
    }, 100)
}

// Activate Skip Buttons
const activeSkipSong = (audio) => {
    musicPlayer.querySelector(".next-btn").addEventListener("click", PLAYLIST.skipNext)
    musicPlayer.querySelector(".prev-btn").addEventListener("click", PLAYLIST.skipPrev)
    audio.addEventListener("ended", PLAYLIST.skipNext)
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
const timeSeekbar = musicPlayer.querySelector(".player-controls .progress")
const seekSlider = timeSeekbar.querySelector(".slider")
const songDuration = musicPlayer.querySelector(".durations .total")
const songCurrentTime = musicPlayer.querySelector(".durations .current")
const musicProgress = musicPlayer.querySelector(".music-progress")

// Make seekbar progress by both visual & song time
const moveSeekSlider = (currentTime, duration) => {
    seekSlider.style.width = `${currentTime / duration * 100}%`
    const isWidthBigger = getStyle(seekSlider, "width") > getStyle(seekSlider, "width", "::after") // Slider progress > Slider width
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
    let newtime = event.offsetX + (getStyle(seekSlider, "width", "::after") / 2)
    audio.currentTime = (newtime / timeSeekbar.clientWidth) * audio.duration
    makeProgress = true
    musicProgress.removeEventListener("mousemove", moveSeekSliderWithCursor)
    window.removeEventListener("mouseup", changeSongTime)
}
// -------------- //

// Mouse Tracker for Songs-Queue
const isMouseOverQueue = (event) => {
    let clickedOn = event.target.classList[0]
    if (Q_CLASSES.includes(clickedOn) === false) {
        musicPlayer.classList.remove("show-queue")
        setTimeout(() => {
            musicPlayer.removeEventListener("click", isMouseOverQueue)
        }, 100)
    }
}
const Q_CLASSES = ["songs-q-container", "heading", "song", "number", "thumbnail", "music-artist", "delete", "extend-q", "add-songs-btn"].concat(Playlist.Q_CLS)

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
        PLAYLIST.shuffle()
    }
    else if (newState == LOOPS[1]) {
        PLAYLIST.sort()
    }
    else audio.loop = true
}