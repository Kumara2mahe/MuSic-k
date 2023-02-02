// ----------------------- Common Helper | Scripts ------------------------- //


// Element style as number
export const getStyle = (el, style, psedo = null) => {
    let value = window.getComputedStyle(el, psedo)[style]
    return Number(value.replace("px", ""))
}

// ---- Seconds to Timestamp | Script ------ //
export const toTimeStamp = (time, hour, formatAsHour) => {
    let timestamp = "", formatTime = Math.floor(time / 60), timeRemains = time % 60

    if (hour == false) {
        if (formatTime >= 60 || formatAsHour) {
            // For Time more than a hour
            timestamp = toTimeStamp(formatTime, true)
        }
        else timestamp += isLesserThan(formatTime)
        timestamp += `:${isLesserThan(timeRemains.toFixed())}`
    }
    else {
        timestamp = `${isLesserThan(formatTime)}:${isLesserThan(timeRemains)}`
    }
    return timestamp
}
const isLesserThan = (number) => {
    return number < 10 ? `0${number}` : number
}
// ------------------- //

// Shuffle array
export const shuffle = (array, exceptIndex) => {
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