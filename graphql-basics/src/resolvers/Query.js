const Query = {
  me: (parent, args, context, info) => ({
    id: 1,
    name: 'Potter',
    password: 'Secre1',
  }),
  users: (parent, args, ctx, info) => {
    if (!args.query) {
      return ctx.db.users;
    }
    return ctx.db.users.filter(user =>
      user.name.toLowerCase().includes(args.query),
    );
  },
  posts: (parent, args, {db}, info) => {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter(post =>
      post.title.toLowerCase().includes(args.query),
    );
  },
  comments: (parent, args, {db}, info) => {
    return db.comments;
  },
};

export {Query as default};
