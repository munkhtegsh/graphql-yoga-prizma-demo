import uuidv4 from 'uuid/v4';
import db from '../db';
import prisma from '../prisma'
import bcrypt from 'bcrypt' // for hashing user password to ...
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import generateJwtToken from '../utils/generateJwtToken'
import hashPassword from '../utils/hashPassword'

// Take input password -> Validate password 8 char -> Hash password -> Generate auth token (jwt)

// const token = jwt.sign({id: 45}, 'mysecret') // first arg is payload, second arg is secret
// console.log(token)

// const decoded = jwt.decode(token)
// console.log(decoded)

// const verified = jwt.verify(token, 'mysecret') // secret must match
// console.log(verified)


const Mutation = {
  async login(parent, args, {prisma}, info) {
    const {email, password} = args.data
    const user = await prisma.query.user({
      where: {
        email
      }
    })

    if(!user) throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(password, ' ', user.password)
    console.log(isMatch)
    if (!isMatch) throw new Error('Unable to login')
    const token = generateJwtToken(user.id)
    // dry
    // const token = jwt.sign({userId: user.id}, 'thisissecret', {expiresIn: '7 days'}) // userId can be anything in the payload obj
    
    return {
      user,
      token
    }
  }, 

  async createUser(parent, args, {db, prisma}, info) {
    // dry
    // if (args.data.password.length < 8) {
    //   throw new Error('Password must be 8 char or longer')
    // }

    // const password = await bcrypt.hash(args.data.password, 10) // hashing, second argument is salt which number of rounds the algo runs that slow your to slow it down to your needs

    const password = await hashPassword(args.data.password)
    const users = await prisma.query.users();
    const emailTaken = users.some(item => item.email === args.data.email)
    console.log(emailTaken)

    if (emailTaken) throw new Error('Email taken')

    // find out why uuid() doesn't need?

    // const user = {
    //   id: uuidv4(),
    //   ...args.data,
    // };
    console.log(args)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,  // hashed password
        // after needed to remove 'info' due to get scalar info back
      }}) //info will return what is info called from graphiql

    console.log(user) 
    console.log(generateJwtToken) 
    const token = generateJwtToken(user.id)
    //dry
    // return {user, token: jwt.sign({userId: user.id}, 'thisissecret', {expiresIn: '7 days'})} //arg1-payload, arg2 - secret, arg3 - expiration time
    return {user, token} 

    // const emailTaken = db.users.some(item => item.email === args.data.email);
    // if (emailTaken) {
    //   throw new Error('Email taken.');
    // }
    // const user = {
    //   id: uuidv4(),
    //   ...args.data,
    // };
    // db.users.push(user);
    // return user;
  },

  async  deleteUser(parent, args, {db, prisma, request}, info) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)

    // Second change
    // const userExist = await prisma.exists.User({id: args.id})

    // if (!userExist) throw new Error('User does not exist')

    // return await prisma.mutation.deleteUser({where: {id: args.id}}, info)

    // third change
    // const userIndex = db.users.findIndex(user => user.id === args.id);
    // if (userIndex === -1) {
    //   throw new Error('User not found');
    // }

    // const deletedUsers = db.users.splice(userIndex, 1);
    // db.posts = db.posts.filter(post => {
    //   console.log(post.author_id, ' ', args.id);
    //   const match = post.author_id === args.id;

    //   if (match) {
    //     db.comments = dbcomments.filter(comment => {
    //       return comment.post_id !== post.id;
    //     });
    //   }
    //   return !match;
    // });

    // db.comments = db.comments.filter(comment => comment.author_id !== args.id);

    // return deletedUsers[0];
  },

  async updateUser(parent, args, {db, prisma, request}, info) {
    const {data} = args
    const userId = getUserId(request)

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password) // if user is updating password return hashed password
    } 

    if (!userId) throw new Error('Unable to update user')
    console.log('PASSWORD: ', data.password)
    const user = await prisma.mutation.updateUser({data: {...data}, where: {id: userId}}, info) // very interesting is happing in spread operator
    // const token = jwt.sign({userId}, 'thisissecret')
    return user
    // const {id, data} = args;
    // const user = db.users.find(user => user.id === id);

    // if (!user) {
    //   throw new Error('User not found');
    // }

    // if (typeof data.email === 'string') {
    //   const emailTaken = db.users.some(user => user.email === data.email);

    //   if (emailTaken) {
    //     throw new Error('Email taken');
    //   }

    //   user.email = data.email;
    // }

    // if (typeof data.name === 'string') {
    //   user.name = data.name;
    // }

    // if (typeof data.naem === 'string') {
    //   user.age = data.age;
    // }

    // return user;
  },

  async createPost(parent, args, {prisma, pubsub, request}, info) {
    // get the header value, pars out the token, verify ... 
    const userId = getUserId(request) //authenticated userId
    return await prisma.mutation.createPost({
      data: {
        title: args.post.title,
        body: args.post.body,
        published: args.post.published,
        author_id: {
          connect: {
            id: userId // removed args.post.author_id 
          }
        }
      }
    }, info)
    // const users = await prisma.query.users();
    // const userExist = users.some(user => user.id === args.post.author_id);
    // if (!userExist) {
    //   throw new Error('User not found');
    // }

    // const data = {
    //   // id: uuidv4(),
    //   ...args.post, // using spread operator to not writing many args keys and values
    // }; // Check it out on npm, the package is called esm. :) better than transfomr-object-rest-spread

    // return prisma.mutation.createPost(data)



    // const userExist = prisma.query.users.some(user => user.id === args.post.author_id);
    // if (!userExist) {
    //   throw new Error('User not found');
    // }

    // const post = {
    //   id: uuidv4(),
    //   ...args.post, // using spread operator to not writing many args keys and values
    // }; // Check it out on npm, the package is called esm. :) better than transfomr-object-rest-spread

    // db.posts.push(post);

    // if (post.published) {
    //   pubsub.publish(`post`, {
    //     post: {
    //       mutation: 'CREATED', //will identify CREATE subscribe
    //       data: post,
    //     },
    //   });
    // }

    // return post;
  },

  async deletePost(parent, args, {db, pubsub, prisma, request}, info) {
    // const postExist = await prisma.exists.Post({id: args.id})
    // if (!postExist) throw new Error('Post does not exist')
    const userId = getUserId(request)

    const postExist = await prisma.exists.Post({ // where can I find this methods? etc exists?
      id: args.id,
      author_id: {
        id: userId
      }
    })

    if (!postExist) throw new Error('Unable to delete post')

    return prisma.mutation.deletePost({ // seems like if you just return promise you don't have to use async 
      where: {
        id: args.id
      }
    }, info)

    // let postIndex = db.posts.findIndex(post => {
    //   return post.id === args.id;
    // });

    // if (postIndex === -1) {
    //   throw new Error('Post not found');
    // }

    // let [deletedPost] = db.posts.splice(postIndex, 1);

    // db.comments = db.comments.filter(comment => {
    //   return comment.post_id !== args.id;
    // });

    // if (deletedPost.published) {
    //   pubsub.publish('post', {
    //     post: {
    //       mutation: 'DELETED',
    //       data: deletedPost,
    //     },
    //   });
    // }
    // return deletedPost;
  },

  // updatePost has the most tricky subscribe logic
  // it will try to compare betwee the prev and next published booleans
  async updatePost(parent, args, {db, pubsub, request}, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.id,
      author_id: {
        id: userId
      }
    })


    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (!postExists) throw new Error('Unable to update post')

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post_id: {
            id: args.id 
          }
        }
      })
    }
 

    return prisma.mutation.updatePost({
      where: {
        id: args.id
      }
    }, info) // short
    // const {id, data} = args;
    // // find post is here
    // // if not throw an error
    // // update datas
    // const post = db.posts.find(post => post.id === id);
    // const originalPost = {...post};

    // if (!post) throw new Error('Post not found!');

    // post.title = data.title || post.title;
    // post.body = data.body || post.body;

    // if (typeof data.published === 'boolean') {
    //   post.published = data.published;

    //   if (originalPost.published && !post.published) {
    //     // deleted
    //     pubsub.publish('post', {
    //       post: {
    //         mutation: 'DELETED', // just for letting you know in the GRAPHQL, it is DELETED
    //         data: originalPost,
    //       },
    //     });
    //   } else if (!originalPost.published && post.published) {
    //     //created
    //     pubsub.publish('post', {
    //       post: {
    //         mutation: 'CREATED',
    //         data: post,
    //       },
    //     });
    //   } else if (originalPost.published && post.published) {
    //     // update
    //     pubsub.publish('post', {
    //       post: {
    //         mutation: 'UPDATED',
    //         data: post,
    //       },
    //     });
    //   }
    // } else if (originalPost.published && post.published) {
    //   // update
    //   pubsub.publish('post', {
    //     post: {
    //       mutation: 'UPDATED',
    //       data: post,
    //     },
    //   });
    // }

    // return post;
  },

  async createComment(parent, args, {db, pubsub, prisma, request}, info) {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({
      id: args.comment.post_id,
      author_id: {
        id: userId,
      },
      published: true // createing comment based on post is published
    })

    if (!postExist) throw new Error('Unable to create comment')

    return await prisma.mutation.createComment({
      data: {
        post_id: {
          connect: {
            id: args.comment.post_id,
          }
        },
        author_id: {
          connect: {
            id: userId
          }
        },
        text: args.comment.text
      },
    })

    // console.log(args)
    // const authorExist = await prisma.exists.User({id: args.comment.author_id})
    // const postExist = await prisma.exists.Post({id: args.comment.post_id})
    // console.log(authorExist)
    // if (!authorExist) throw new Error('Author does not exist')
    // if (!postExist) throw new Error('Post does not exist')
    // return await prisma.mutation.createComment({
    //   data: {
    //     text: args.comment.text,
    //     author_id: {
    //       connect: {
    //         id: args.comment.author_id
    //       }
    //     },
    //     post_id: {
    //       connect: {
    //         id: args.comment.post_id
    //       }
    //     }
    //   }

    // }, info)


    // console.log(args);
    // const authorExist = db.users.some(
    //   user => user.id === args.comment.author_id,
    // );
    // const postExist = db.posts.some(
    //   post => post.id === args.comment.post_id && post.published,
    // );

    // if (!authorExist) {
    //   throw new Error('Author doesn not exist');
    // }

    // if (!postExist) {
    //   throw new Error('Post does not exist');
    // }

    // const comment = {
    //   id: uuidv4(),
    //   ...args.comment,
    //   // text: args.comment.text, // Could have use here ...args.comment and did it :)
    //   // author_id: args.comment.author_id,
    //   // post_id: args.comment.post_id,
    // };

    // db.comments.push(comment);

    // // Enums for 3 or more potential values you know it ahead of time
    // pubsub.publish(`comment ${args.comment.post_id}`, {
    //   comment: {
    //     mutation: 'CREATEE',
    //     data: comment,
    //   },
    // }); // send notification when subscribe new Comment
    // return comment;
  },

  async deleteComment(parent, args, {db, pubsub, prisma, request}) {
    const userId = getUserId(request)

    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author_id: {
        id: userId
      }
    })


    if (!commentExist) throw new Error('Comment does not exist')

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)

    // let commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    // if (commentIndex === -1) {
    //   throw new Error('Comment not found');
    // }

    // const deletedComment = db.comments.splice(commentIndex, 1);

    // pubsub.publish(`comment ${deletedComment[0].post_id}`, {
    //   comment: {
    //     mutation: 'DELETE',
    //     data: deletedComment[0],
    //   },
    // });

    // return deletedComment[0];
  },

  async updateComment(parent, args, {prisma, db, pubsub, request}, info) {
    const userId = getUserId(request)

    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author_id: {
        id: userId
      },
    })

    if (!commentExist) throw new Error('Unable to update')


    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
      // {
        // post_id: {
        //   connect: {
        //     id: args.id
        //   }
        // },
        // text: args.data.text
      // },
    }, info)

    // const comment = db.comments.find(comment => comment.id === args.id);
    // if (!comment) throw new Error('Comment not found');
    // comment.text = args.data.text;

    // pubsub.publish(`comment ${comment.post_id}`, {
    //   comment: {
    //     mutation: 'UPDATE',
    //     data: comment,
    //   },
    // });

    // return comment;
  },
};

export {Mutation as default};
