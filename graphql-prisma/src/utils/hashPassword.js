import bcrypt from 'bcrypt'

const hashPassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password must be 8 char or longer')
    }

    return bcrypt.hash(password, 10) // hashing, second argument is salt which number of rounds the algo runs that slow your to slow it down to your need




}

export {hashPassword as default}