import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, {db}, info) {
    console.log(args);
    const emailTaken = db.users.some(item => item.email === args.data.email);
    if (emailTaken) {
      throw new Error('Email taken.');
    }
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },

  deleteUser(parent, args, {db}) {
    const userIndex = db.users.findIndex(user => user.id === args.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(post => {
      console.log(post.author_id, ' ', args.id);
      const match = post.author_id === args.id;

      if (match) {
        db.comments = dbcomments.filter(comment => {
          return comment.post_id !== post.id;
        });
      }
      return !match;
    });

    db.comments = db.comments.filter(comment => comment.author_id !== args.id);

    return deletedUsers[0];
  },

  updateUser(parent, args, {db}, info) {
    const {id, data} = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.naem === 'string') {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, {db, pubsub}, info) {
    const userExist = db.users.some(user => user.id === args.post.author_id);
    if (!userExist) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.post, // using spread operator to not writing many args keys and values
    }; // Check it out on npm, the package is called esm. :) better than transfomr-object-rest-spread

    db.posts.push(post);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED', //will identify CREATE subscribe
          data: post,
        },
      });
    }

    return post;
  },

  deletePost(parent, args, {db, pubsub}) {
    let postIndex = db.posts.findIndex(post => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    let [deletedPost] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(comment => {
      return comment.post_id !== args.id;
    });

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }
    return deletedPost;
  },

  // updatePost has the most tricky subscribe logic
  // it will try to compare betwee the prev and next published booleans
  updatePost(parent, args, {db, pubsub}, info) {
    const {id, data} = args;
    // find post is here
    // if not throw an error
    // update datas
    const post = db.posts.find(post => post.id === id);
    const originalPost = {...post};

    if (!post) throw new Error('Post not found!');

    post.title = data.title || post.title;
    post.body = data.body || post.body;

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED', // just for letting you know in the GRAPHQL, it is DELETED
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      } else if (originalPost.published && post.published) {
        // update
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post,
          },
        });
      }
    } else if (originalPost.published && post.published) {
      // update
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, {db, pubsub}, info) {
    console.log(args);
    const authorExist = db.users.some(
      user => user.id === args.comment.author_id,
    );
    const postExist = db.posts.some(
      post => post.id === args.comment.post_id && post.published,
    );

    if (!authorExist) {
      throw new Error('Author doesn not exist');
    }

    if (!postExist) {
      throw new Error('Post does not exist');
    }

    const comment = {
      id: uuidv4(),
      ...args.comment,
      // text: args.comment.text, // Could have use here ...args.comment and did it :)
      // author_id: args.comment.author_id,
      // post_id: args.comment.post_id,
    };

    db.comments.push(comment);

    // Enums for 3 or more potential values you know it ahead of time
    pubsub.publish(`comment ${args.comment.post_id}`, {
      comment: {
        mutation: 'CREATEE',
        data: comment,
      },
    }); // send notification when subscribe new Comment
    return comment;
  },

  deleteComment(parent, args, {db, pubsub}) {
    let commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const deletedComment = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment[0].post_id}`, {
      comment: {
        mutation: 'DELETE',
        data: deletedComment[0],
      },
    });

    return deletedComment[0];
  },

  updateComment(parent, args, {db, pubsub}, info) {
    const comment = db.comments.find(comment => comment.id === args.id);
    if (!comment) throw new Error('Comment not found');
    comment.text = args.data.text;

    pubsub.publish(`comment ${comment.post_id}`, {
      comment: {
        mutation: 'UPDATE',
        data: comment,
      },
    });

    return comment;
  },
};

export {Mutation as default};
