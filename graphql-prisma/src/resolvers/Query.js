const Query = {
  users: (parent, args, ctx, info) => {
    if (!args.query) {
      return ctx.db.users;
    }
    return ctx.db.users.filter(user =>
      user.name.toLowerCase().includes(args.query),
    );
  },
};

export {Query as default};
