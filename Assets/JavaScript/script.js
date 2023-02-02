
import { makeVisible, setupPlayback, pauseSong } from "./playback.js"
import { setVolumeControls } from "./volume.js"

const copyrights = document.querySelector("footer.copyrights")
const musicPlayer = document.querySelector(".music-player")
musicPlayer.classList.add("invisible", "fade-out")

// ------- Loading Launcher ------- //
window.addEventListener("DOMContentLoaded", () => {
    const launcher = document.querySelector(".launcher")
    launcher.classList.add("loaded")
    setTimeout(() => {
        launcher.classList.add("fade-out")
        makeVisible(musicPlayer)
        setTimeout(() => {
            launcher.remove()
            musicPlayer.classList.replace("fade-out", "fade-in")
            document.body.classList.remove("max-height")
            makeVisible(copyrights)
        }, 300)
    }, 1000)
})
const audio = musicPlayer.querySelector("#audio-player")

// Set up Playback
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