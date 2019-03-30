const User = {
  posts(parent, args, {id}) {
    console.log(parent); // parent is User data
    return db.posts.filter(post => post.author_id === parent.id);
  },
  comments(parent, args, {db}) {
    return db.comments.filter(comment => comment.author_id === parent.id);
  },
};

export {User as default};
