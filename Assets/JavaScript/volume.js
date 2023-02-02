// ----------------------- Volume (Seek, Mute) | Script ------------------------- //

const musicPlayer = document.querySelector(".music-player")
const volumeButton = musicPlayer.querySelector(".top-container .volume-btn")
const volumeChanger = musicPlayer.querySelector(".top-container .change-volume")
const volumeLevel = volumeChanger.querySelector(".volume-level")
const LEVELS = ["full", "low", "mute"], MIN = 0, MAX = 1


// ------ Volume Controls Initiator | Scripts ----- //
export const setVolumeControls = (audio) => {

    // Track mouse pointer
    const trackMpointer = (event) => {
        let hoveringOn = event.target.classList[0]
        if (CLASSES.includes(hoveringOn) === false) {
            volumeChanger.removeAttribute("style")
            musicPlayer.removeEventListener("mouseover", trackMpointer)
            removeDragEvent()
        }
    }
    volumeButton.addEventListener("mouseenter", () => {
        volumeChanger.style.opacity = 1
        musicPlayer.addEventListener("mouseover", trackMpointer)
    })
    volumeButton.addEventListener("click", () => {
        muteVolume(audio)
    })
    setVolume(audio)
    seekingProgress(audio)
}
const CLASSES = ["volume-container", "volume-btn", "change-volume", "volume-level", "slider"]
// ----------------------------- //

// Set volume and Icon
const setVolume = (audio) => {
    let slider = volumeLevel.querySelector(".slider")
    let level = volumeButton.classList[2], volume = audio.volume
    slider.style.height = `${volume * 100}%`
    slider.style.alignItems = volume ? "flex-start" : "flex-end"
    if (volume > 0.8) {
        volumeButton.classList.replace(level, LEVELS[0])
    }
    else {
        if (volume <= MIN) {
            volumeButton.classList.add("mute")
        }
        else {
            volumeButton.classList.remove("mute")
        }
        volumeButton.classList.replace(level, LEVELS[1])
    }
}

// Volume Seeking
const seekingProgress = (audio) => {
    volumeChanger.addEventListener("mousedown", (event) => {
        changeSliderPosition(event)
        volumeChanger.addEventListener("mousemove", changeSliderPosition)
        volumeChanger.addEventListener("mouseup", removeDragEvent)
    })
    audio.addEventListener("volumechange", () => {
        setVolume(audio)
    })
}

// Volume Change
const changeSliderPosition = (event) => {
    let active = event.target, newVolume, audio = musicPlayer.querySelector("#audio-player"),
        diff = volumeLevel.clientHeight - active.clientHeight

    if (active.classList[0] == "change-volume") diff = diff / 2
    newVolume = (volumeLevel.clientHeight - (event.offsetY + diff)) / volumeLevel.clientHeight
    audio.volume = newVolume > MAX || newVolume < MIN ? newVolume.toFixed(0) : newVolume.toFixed(1)
}
const removeDragEvent = () => {
    volumeChanger.removeEventListener("mousemove", changeSliderPosition)
    volumeChanger.removeEventListener("mouseup", removeDragEvent)
}

// Mute volume
const muteVolume = (audio) => {
    if (volumeButton.classList.contains(LEVELS[2])) {
        volumeButton.classList.remove(LEVELS[2])
        audio.muted = false
        audio.volume = tempVolume
    }
    else {
        volumeButton.classList.add(LEVELS[2])
        audio.muted = true
        tempVolume = audio.volume
        audio.volume = MIN
    }
}
var tempVolume = MIN // For Storing Volume in mute