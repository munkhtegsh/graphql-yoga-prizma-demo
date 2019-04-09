import getUserId from '../utils/getUserId'
import { Prisma } from 'prisma-binding';

const User = {
  // individually hiding emails based on user authenticated
  // however, there is a edge case for email relied on id from info
  email: {
    fragment: 'fragment userId on User {id}',
    resolve: (parent, args, {request}, info) => {
      const userId = getUserId(request, false)
      // console.log('Parent ', parent.userId)
      console.log('HMM ',parent.id) // undefined, need to solve this 
  
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
   }
  },

  posts: {
    fragment: 'fragment userId on User {id}',
    resolve: (parent, args, {prisma, request}, info) => {
      const userId = getUserId(request)

      return prisma.query.posts({
        where: {
          published: true,
          author_id: {id: parent.id}
        }
      })
    }
  },

  // not returning password in the front-end
  password: (parent, args, ctx, info) => {
    return ''
  }
  // deleted below code due to work nested relation posts in users query
  // it works because we are passing info argument, look at Query.js line 18

  // posts(parent, args, {db, prisma}) {
  //   console.log(parent); // parent is User data
  //   return db.posts.filter(post => post.author_id === parent.id);
  // },
  // comments(parent, args, {db}) {
  //   return db.comments.filter(comment => comment.author_id === parent.id);
  // },
};

export {User as default};
