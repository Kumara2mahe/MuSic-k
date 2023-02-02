
import { makeVisible, setupPlayback, pauseSong } from "./playback.js"
import { setVolumeControls } from "./volume.js"

const copyrights = document.querySelector("footer.copyrights")
const musicPlayer = document.querySelector(".music-player")

// ------- Loading Launcher ------- //
window.addEventListener("DOMContentLoaded", () => {
    const launcher = document.querySelector(".launcher")
    launcher.classList.add("loaded")
    setTimeout(() => {
        launcher.classList.add("fade-out")
        makeVisible(musicPlayer)
        switchDarkMode() // Switch to dark mode if choosen
        setTimeout(() => {
            launcher.remove()
            musicPlayer.classList.replace("fade-out", "fade-in")
            document.body.classList.remove("max-height")
            makeVisible(copyrights)
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
const audio = musicPlayer.querySelector("#audio-player")
setupPlayback(audio)

// Volume Controls
setVolumeControls(audio)

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
                pauseSong(audio)
            }, minutes * 6 * 10 ** 4)
        }
    }
})
// ----------------------------- //