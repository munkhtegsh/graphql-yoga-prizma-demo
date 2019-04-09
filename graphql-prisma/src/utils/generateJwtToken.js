import jwt from 'jsonwebtoken'

const generateJwtToken = (userId) => {
    return jwt.sign({userId}, 'thisissecret', {expiresIn: '7 days'})
}

export {generateJwtToken as default}