
import { Playlist } from "./playlist.js"
import { setupPlayback } from "./playback.js"
import { setVolumeControls } from "./volume.js"

const copyrights = document.querySelector("footer.copyrights")
const musicPlayer = Playlist.musicPlayer

// ------- Loading Launcher ------- //
window.addEventListener("DOMContentLoaded", () => {
    const launcher = document.querySelector(".launcher")
    launcher.classList.add("loaded")
    setTimeout(() => {
        launcher.classList.add("fade-out")
        Playlist.makeVisible(musicPlayer)
        switchDarkMode() // Switch to dark mode if choosen
        setTimeout(() => {
            launcher.remove()
            musicPlayer.classList.replace("fade-out", "fade-in")
            document.querySelector("main").classList.remove("max-height")
            Playlist.makeVisible(copyrights)
        }, 300)
    }, 1000)
})

// Toggle Dark Mode
const THEME = "music-k-theme", D_MODE = "dark-mode", DK = "dark"
const switchDarkMode = (event) => {
    const isDarkmode = window.localStorage.getItem(THEME) == DK
    if (event != null) {
        if (isDarkmode) {
            window.localStorage.removeItem(THEME)
            document.body.classList.remove(D_MODE)
        }
        else {
            window.localStorage.setItem(THEME, DK)
            document.body.classList.add(D_MODE)
        }
    }
    else if (isDarkmode) {
        document.body.classList.add(D_MODE)
    }
}
const darkModeBtn = musicPlayer.querySelector(".dark-mode-btn")
darkModeBtn.addEventListener("click", switchDarkMode)

// Set up Playback
setupPlayback()

// Volume Controls
setVolumeControls(Playlist.audioElement)

// ------ SleepTimer | Scripts ----- //
const sleepTimerBtn = musicPlayer.querySelector(".control-btns .sleeptimer-btn"), ON = "on"
sleepTimerBtn.addEventListener("click", () => {
    if (sleepTimerBtn.classList.contains(ON)) {
        sleepTimerBtn.classList.remove(ON)
    }
    else {
        let minutes = prompt("Sleep After (minutes)")
        if (isNaN(+minutes) == false) {
            sleepTimerBtn.classList.add(ON)
            setTimeout(() => {
                sleepTimerBtn.classList.remove(ON)
                Playlist.pauseSong()
            }, minutes * 6 * 10 ** 4)
        }
    }
})
// ----------------------------- //