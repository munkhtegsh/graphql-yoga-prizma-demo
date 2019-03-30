import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

// exists checks comment id with author_id or without author_id
prisma.exists.Comment({
    id: "cjto1npki02f60766tyxyj90o",
    author_id: {
        id: "cjtnyf9ez00ui0766gp7pv482" 
    }
}).then(exists => {
    console.log(exists)

})



// First arg operation is null, second arg selection set
// prisma.query.users(null, '{id name post {id title}}')
//     .then(res => {
//         console.log(JSON.stringify(res, undefined, 2))
//     })

// prisma.query.comments(null, '{id text author_id {id name} post_id {id title}}')
//     .then(res => {
//         console.log(res)
//     })

// prisma.mutation.createUser({
//     data: {
//         name: "Kerry",
//         email: "ekr.yahoo.com"
//     }
// }, `{id name}`)

const createPostForUser = async (author_id, data) => {
    const userExist = await prisma.exists.User({
       id: author_id
    })

    if (!userExist) throw new Error('User does not exist!')
    
    const post = prisma.mutation.createPost({
        data: {
            ...data,
            author_id: {
                connect: {
                    id: "cjtnyf9ez00ui0766gp7pv482"
                }
            }
        }
    }, '{ id }')

    const user = await prisma.query.user({
        where: {
            id: author_id
        }
    }, '{id name email post {id title published}}')

    return user
    
}

// createPostForUser("cjtnyf9ez00ui0766gp7pv482", {
//     title: "Great books to read",
//     body: "War of art",
//     published: true
// }).then(user => {
//     console.log(user)
// }).catch(error => {
//     console.log(error)
// })

const updatePostForUser = async(post_id, data) => {
    const postExist = await prisma.exists.Post({
        id: post_id
    })

    console.log(postExist)

    if (!postExist) throw new Error('Post does not exists!')

    const post = await prisma.mutation.updatePost({
        data,
        where: {id: post_id}
    }, '{author_id {id name email post {id title published}}}')

    // const user = await prisma.query.user({where: {id: post.author_id.id}})
    return post.author_id
}

// updatePostForUser("cjtnzkgr901j9076634jdt1cb", {
//     published: false,
// }).then(res => {
//     console.log(res)
// }).catch(error =>{
//     console.log(error.message)
// })