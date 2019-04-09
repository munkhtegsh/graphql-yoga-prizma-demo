import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
    const header = request.request 
    ?
    request.request.headers.authorization
    :
    request.connection.context.Authorization // using websockets for subscription


    if (header) {
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisissecret') //it also verifies token is expired
        console.log(decoded)
        return decoded.userId
    }

    // requireAuth for hiding unpublished posts from others
    if (requireAuth) {
        throw new Error('Authentication required')
    }

    return null
}

export {getUserId as default}