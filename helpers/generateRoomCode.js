function generateCode(length = 6){
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let result = ''
    for (let i = 0; i < length; i++){
        const roomCode = Math.floor(Math.random() * char.length)
        result += char.charAt(roomCode)
        
    }

    return result 

}

// console.log(generateCode(6))

module.exports = generateCode