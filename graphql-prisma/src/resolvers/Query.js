
import getUserId from '../utils/getUserId'

const Query = {
  // User.js runs after this
  users: (parent, args, {prisma}, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip, // without declare them like this, first and skip stil works if you pass info in the prisma.query.users() 
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        OR: [{     // using OR or AND operator 
          name_contains: args.query
        }]
      }
    }
    // nothing, string, object 
    // nothing will return only scalar values (won't return nested values)
    // string will provide us '{author {id: "dfdf"}}', but we don't know what is returning
    // object will carry info 
    return prisma.query.users(opArgs, info) //pass opArgs to use where method in the query!

    // if (!args.query) {
    //   return db.users;
    // }
    // return db.users.filter(user =>
    //   user.name.toLowerCase().includes(args.query),
    // );
  },

  myPosts: async (parent, args, {prisma, request}, info) => {
    const userId = getUserId(request)
    const opArgs = {
      where: {
        author_id: {
          id: userId
        },
        orderBy: args.orderBy
      }
    }

    // check title or body contains query str
    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      },
      {
        body_contains: args.query
      }]
    }

    const posts = await prisma.query.posts(opArgs, info)
    return posts
  },
  
  posts: (parent, args, {prisma}, info) => {
    const opArgs = {
      where: {
        published: true,
      },
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query 
       },{
         body_contains: args.query
       }]
    }

    return prisma.query.posts(opArgs, info)
  },
  
  comments: (parent, args, {prisma}, info) => {
    const opArgs = {
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        text_contains: args.query
      }
    }
    
    return prisma.query.comments(opArgs, info)
  },

  async  me(parent, args, {prisma, request}, info) {
    const userId = getUserId(request)

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    })

    if (!user) throw new Error('Unable to find user')
    return user
  }, 

  // hiding unpublished posts ant pots will appear when user authenticated or published
  async  post(parent, args, {prisma, request}, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: args.id, // args.id is post id
        OR: [{
          published: true
        }, {
          author_id: {
            id: userId
          }
       }]
      }
    }, info)

    if (posts.length === 0) throw new Error('Post not found')
    return posts[0]
  }
};

export {Query as default};
