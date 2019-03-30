const Subscription = {
  count: {
    subscribe(parent, args, ctx, info) {
      let count = 0;

      setInterval(() => {
        count++;
        ctx.pubsub.publish('count', {
          //publishing on count channel
          count,
        });
      }, 1000);

      return ctx.pubsub.asyncIterator('count'); // channel name count
    },
  },

  comment: {
    subscribe(parent, {postId}, {db, pubsub}, info) {
      console.log(postId);
      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },

  post: {
    subscribe(parent, args, {db, pubsub}, info) {
      return pubsub.asyncIterator(`post`);
    },
  },
};

export {Subscription as default};
