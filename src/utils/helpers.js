// function to change timestamp to readable time
export const formatDate = (timestamp) => {
    const date = new Date(timestamp.toMillis())
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}


// generate unique id
export const generateKey = () => {
    return Math.random().toString(36).substring(2,10)
}


//function to sort time based on timestamp
export const sortMessagesByTimestamp = (message) => { 
    return message.sort(
        (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
)
}