// handling relation between posts and users with author
const Post = {
  // explanation is in User.js 
  
  // author_id(parent, args, {db}) {
  //   // author_id naming must much in schema
  //   // console.log(parent); //parent is Post data
  //   return db.users.find(user => user.id === parent.author_id);
  // },
  // comments(parent, args, {db}, info) {
  //   return db.comments.filter(function(comment) {
  //     return comment.post_id === parent.id;
  //   });
  // },
};

export {Post as default};
