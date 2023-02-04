

/** Playlist of songs, with raw song and its metadata */
export class Playlist {
    /** 
     * Class for creating and updating the Songs Playlist, and to keep track of song playing
     */
    constructor() {
        this.playing = null
        this.songcount = 0
        this.songs = []
        this.unknown = 0
    }
    /**
     * Add file to playist
     * @param {File} song takes audio file as raw File object
     * @returns index of the song in playlist
     */
    #add(song) {
        let songIndex = this.songs.push({ rawfile: song })
        return songIndex - 1
    }/**
     * To convert a arraybuffer to base64url string
     * @param {*} tags contains the audio file metadata like cover picture, artist name and title
     * @returns url string can be used as CSS background-image value
     */
    #toBase64StringUrl(tags) {
        let sCoverUrl
        if (tags.hasOwnProperty(Playlist.#picture)) {
            let arrayBuffer = tags.picture.data, format = tags.picture.format,
                base64String = arrayBuffer.reduce((data, byte) => {
                    return data + String.fromCharCode(byte);
                }, "");
            sCoverUrl = `url(data:${format};base64,${window.btoa(base64String)})` // base64 Cover Url
        }
        else sCoverUrl = Playlist.defaultCover
        return sCoverUrl
    }
    /**
     * To get title of the song
     * @param {*} tags contains the audio file metadata like cover picture, artist name and title
     * @returns title of song from the metadata or returns 'Unknown Track' with a number
     */
    #getTitle(tags) {
        let sTitle, duplicates
        if (tags.hasOwnProperty(Playlist.#title)) {
            sTitle = tags.title.trim()
        }
        else {
            sTitle = Playlist.#toDigit(++this.unknown)
            sTitle = Playlist.defaultTitle + sTitle
        }
        duplicates = this.songs.filter((song) => { return song.title == sTitle })
        if (duplicates = duplicates.length) sTitle = `${sTitle} (${duplicates})`
        return sTitle
    }
    /**
     * To get the artist name from the song
     * @param {*} tags contains the audio file metadata like cover picture, artist name and title
     * @returns name of artist from metadata or returns null
     */
    #getArtist(tags) {
        let sArtist
        if (tags.hasOwnProperty(Playlist.#artist)) {
            sArtist = tags.artist.trim()
        }
        else sArtist = Playlist.defaultArtist
        return sArtist
    }
    /** To remove song from both playlist and queue */
    #removeSong = (event) => {
        let songContainer = event.target.parentElement
        let sIndex = this.#getSongIdbyTitle(songContainer)
        songContainer.remove()
        this.songs.splice(sIndex, 1)
        if (--this.songcount && sIndex == this.playing) {
            this.loadSong(sIndex == this.songcount ? --sIndex : sIndex)
        }
        else if (this.songcount === 0) this.resetPlayer()
    }
    /** To switch the song state to playing/pause or to load new song */
    #switchSong = (event) => {
        let songPick = event.target, sIndex
        if (Playlist.Q_CLS.includes(songPick) == false) {
            songPick = songPick.parentElement
        }
        sIndex = this.#getSongIdbyTitle(songPick)
        if (sIndex == this.playing) {
            Playlist.switchPlaybackState()
        }
        else this.loadSong(sIndex)
    }
    /** To arrange an array by its property 'title' */
    #sortbyTitle = (s1, s2) => {
        let title1 = s1.title.toUpperCase()
        let title2 = s2.title.toUpperCase()
        return this.#sortArray(title1, title2)
    }
    /** To arrange an array by its 'innerHTML' */
    #sortbyInnerHtml = (s1, s2) => {
        let title1 = s1.querySelector(`.${Playlist.Q_CLS[2]}`).innerHTML.toUpperCase()
        let title2 = s2.querySelector(`.${Playlist.Q_CLS[2]}`).innerHTML.toUpperCase()
        return this.#sortArray(title1, title2)
    }
    #sortArray(name1, name2) {
        if (name1 < name2) return -1
        else if (name1 > name2) return 1
        return 0
    }
    /** To update song info, such as cover picture, artist name and title */
    #updateSongCover(cover = null) {
        if (cover) {
            document.body.style.backgroundImage = Playlist.audioCover.style.backgroundImage = cover
        }
        else {
            Playlist.audioCover.removeAttribute("style")
            document.body.removeAttribute("style")
        }
    }
    /**
     * To update the current playing song index in Playlist
     * @param {HTMLElement} song a HTMLElement which contains a class as a reference to playing song
     */
    #updatePlayingSongIndex(song) {
        if (song.classList.contains("playing")) {
            this.playing = this.#getSongIdbyTitle(song)
        }
    }
    /**
     * To get the song index in Playlist by its title
     * @param {HTMLElement} songContainer a HTMLElement which contains the details of playing song along with title
     * @returns 
     */
    #getSongIdbyTitle(songContainer) {
        let sTitle = songContainer.querySelector(`.${Playlist.Q_CLS[2]}`).innerHTML
        let song = this.songs.find((song) => { return song.title == sTitle })
        return this.songs.indexOf(song)
    }
    /** To reset the Playlist & musicplayer to default state */
    resetPlayer() {
        this.playing = null
        Playlist.audioElement.src = ""
        Playlist.audioElement.removeAttribute("src")
        Playlist.audioElement.srcObj = null
        Playlist.musicPlayer.classList.remove("play")
        this.#updateSongCover()
        Playlist.makeInVisible(Playlist.audioTitle, "")
        Playlist.makeInVisible(Playlist.audioArtist, "")
        Playlist.pauseAnimation()
    }
    /**
     * To get file metadata
     * @param {Object} tags contains the audio file metadata like cover picture, artist name and title
     */
    getMetaData(rawfile, tags) {
        let sIndex = this.#add(rawfile)
        let song = this.songs[sIndex]
        song.title = this.#getTitle(tags)
        song.metaData = {
            coverUrl: this.#toBase64StringUrl(tags),
            artist: this.#getArtist(tags)
        }
        this.extendQueue({
            title: song.title,
            coverUrl: song.metaData.coverUrl,
            artist: song.metaData.artist
        }, sIndex)
    }
    /**
     * @param {Object} songInfo contains the song title, artist name and cover picture url as a object
     */
    extendQueue(songInfo) {
        let songDetail = document.createElement("div"), sArtist
        songDetail.classList.add("song")
        sArtist = songInfo.artist ? `<p class="music-artist no-overflow">${songInfo.artist}</p>` : "unknown"
        songDetail.innerHTML = `<span class="number"></span>
                                <div class="details">
                                    <div class="thumbnail"></div>
                                    <div class="info no-overflow">
                                        <h4 class="music-title no-overflow">${songInfo.title}</h4>${sArtist}
                                    </div>
                                </div>
                                <span class="delete"></span>`
        Playlist.addtoQParent.before(songDetail)
        songDetail.querySelector(".delete").addEventListener("click", this.#removeSong)
        songDetail.querySelector(".details").addEventListener("click", this.#switchSong)
    }
    /** To sort the song objects in playlist by ascending order with its title */
    sort() {
        let songsInQ = Playlist.musicPlayer.querySelectorAll(".song")
        this.songs.sort(this.#sortbyTitle)
        let newOrder = [...songsInQ].sort(this.#sortbyInnerHtml)
        songsInQ.forEach((song, index) => {
            this.#updatePlayingSongIndex(song)
            Playlist.addtoQParent.before(newOrder[index])
        })
    }
    /** To randomly shuffle the song objects in playlist with its title */
    shuffle() {
        let songsInContainer = [...Playlist.musicPlayer.querySelectorAll(".song")],
            playingSIndex = this.playing
        this.songs = Playlist.shuffleArr(this.songs, playingSIndex)
        this.songs.forEach((song) => {
            songsInContainer.filter((songIn) => {
                let matchedSong = songIn.querySelector(`.${Playlist.Q_CLS[2]}`)
                if (matchedSong && matchedSong.innerHTML == song.title) {
                    this.#updatePlayingSongIndex(songIn)
                    Playlist.addtoQParent.before(songIn)
                }
            })
        })
    }
    /**
     * To load the song to audio element
     * @param {number} sIndex access a particular song from playlist by its index
     */
    loadSong = (sIndex) => {
        let song = this.songs[sIndex], audio = Playlist.audioElement
        audio.src = Playlist.#createBlobUrl(song.rawfile) // create blob url from file
        this.playing = sIndex
        Playlist.#switchPlayingState(sIndex + 1)

        // Update Song Info
        this.#updateSongCover(song.metaData.coverUrl)
        Playlist.makeVisible(Playlist.audioTitle, song.title)
        Playlist.makeVisible(Playlist.audioArtist, song.metaData.artist)
        Playlist.playSong()
    }
    /** Skip to next song in playlist */
    skipNext = () => {
        Playlist.pauseSong()
        if (this.songs.length) {
            if (this.playing >= this.songs.length - 1) {
                this.loadSong(0)
            }
            else this.loadSong(++this.playing)
        }
    }
    /** Skip to previous song in playlist */
    skipPrev = () => {
        Playlist.pauseSong()
        if (this.songs.length) {
            if (this.playing <= 0) {
                this.loadSong(this.songs.length - 1)
            }
            else this.loadSong(--this.playing)
        }
    }
    static #title = "title"
    static #artist = "artist"
    static #picture = "picture"
    static BLOBURL_K = "music-k-blob-file-url"
    static {
        this.VISIBILITY = ["invisible", "visible"]
        this.defaultCover = "url('./Assets/Images/thumb.png')"
        this.defaultTitle = "Unknown Track "
        this.defaultArtist = null
        this.musicPlayer = document.querySelector(".music-player")
        this.audioElement = this.musicPlayer.querySelector("#audio-player")
        this.playButton = this.musicPlayer.querySelector(".control-btns .play-btn")
        this.audioCover = this.musicPlayer.querySelector(".cover-picture .thumb")
        this.audioTitle = this.musicPlayer.querySelector(".music-title")
        this.audioArtist = this.musicPlayer.querySelector(".music-artist")
        this.addtoQParent = this.musicPlayer.querySelector(".songs-q-container .extend-q")
        this.Q_CLS = ["details", "info", "music-title"]
        this.PLAYBACK = ["resume", "pause"]
    }
    /**
     * To convert a number to string with leading-zero
     * @param {number} songNumber integer to be converted as string with leading-zero
     * @returns a string of number( with leading-zero if string length is lessthan 10)
     */
    static #toDigit(songNumber) {
        return songNumber < 10 ? `0${songNumber}` : songNumber
    }
    /** 
     * Create Blob url from file & reference it on localstorage
     * @param {File} file takes audio file as raw File object
     */
    static #createBlobUrl(file) {
        this.clearBlobUrl() // clear old url
        let url = URL.createObjectURL(file)
        window.localStorage.setItem(this.BLOBURL_K, url)
        return url
    }
    /** Clear reference to Blob url from everywhere */
    static clearBlobUrl() {
        let blobUrl = window.localStorage.getItem(this.BLOBURL_K)
        if (blobUrl != null && blobUrl != "") {
            URL.revokeObjectURL(blobUrl)
            window.localStorage.removeItem(this.BLOBURL_K)
        }
    }
    /**
     * To switch the state of playing song in the song queue
     * @param {number} sIndex access a particular song from song queue by its index
     */
    static #switchPlayingState(sIndex) {
        let playingSong = this.musicPlayer.querySelector(".song.playing")
        if (playingSong) {
            playingSong.classList.remove("playing")
        }
        this.musicPlayer.querySelector(`.song:nth-of-type(${sIndex})`).classList.add("playing")
    }
    /** To switch playback to either play/pause state */
    static switchPlaybackState() {
        if (this.playButton.classList.contains(this.PLAYBACK[0])) {
            this.playSong()
        }
        else this.pauseSong()
    }
    /** To Play Song loaded in audio element */
    static playSong() {
        this.audioElement.play()
    }
    /** To Pause a playing Song in audio element */
    static pauseSong() {
        this.audioElement.pause()
    }
    /** To play the song playing animations */
    static playAnimation = () => {
        this.playButton.classList.replace(this.PLAYBACK[0], this.PLAYBACK[1])
        this.musicPlayer.classList.add("play")
    }
    /** To pause the song playing animations */
    static pauseAnimation = () => {
        this.playButton.classList.replace(this.PLAYBACK[1], this.PLAYBACK[0])
        this.musicPlayer.classList.remove("play")
    }
    /**
     * To make a element from hidden to visible 
     * @param {HTMLElement} element which needs to be visible from hidden
     * @param {string} newContent string which is used as the element's new innerHTML
     */
    static makeVisible = (element, newContent = null) => {
        if (newContent) element.innerHTML = newContent
        element.classList.replace(this.VISIBILITY[0], this.VISIBILITY[1])
    }
    /**
     * To make a element back to hidden
     * @param {HTMLElement} element which needs to be hidden again
     * @param {string} newContent string which is used as the element's new innerHTML
     */
    static makeInVisible = (element, newContent = null) => {
        if (newContent) element.innerHTML = newContent
        element.classList.replace(this.VISIBILITY[1], this.VISIBILITY[0])
    }
    /**
     * To Shuffle a Array(any iterable)
     * @param {Array} array a iterable which need to be shuffled
     * @param {number} exceptIndex an integer represents the index in the passed in iterable which don't change position while shuffling
     * @returns a randomly shuffled Array(any iterable)
     */
    static shuffleArr(array, exceptIndex) {
        let arrLen = array.length, temp, randIndex;
        while (arrLen) {
            randIndex = Math.floor(Math.random() * arrLen--)

            // Swaping elements
            if (randIndex != exceptIndex) {
                temp = array[arrLen]
                array[arrLen] = array[randIndex]
                array[randIndex] = temp
            }
        }
        return array
    }
}