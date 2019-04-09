import getUserId from '../utils/getUserId'

const Subscription = {
    // count: {
    //   subscribe(parent, args, ctx, info) {
    //     let count = 0;
  
    //     setInterval(() => {
    //       count++;
    //       ctx.pubsub.publish('count', {
    //         //publishing on count channel
    //         count,
    //       });
    //     }, 1000);
  
    //     return ctx.pubsub.asyncIterator('count'); // channel name count
    //   },
    // },
  
    comment: {
      subscribe(parent, {postId}, {prisma}, info) {
        // needed to change data to node in schema.graphql
        // prisma -> node -> Client (graphql, playground)

        // using :4466 where 
        return prisma.subscription.comment({
          where: {
            node: {
              post_id: {
                id: postId
              }
            }
          }
        }, info)
      }
      // subscribe(parent, {postId}, {db, pubsub}, info) {
      //   console.log(postId);
      //   return pubsub.asyncIterator(`comment ${postId}`);
      // },
    },
  
    // post subscribe checks published 
    post: {
      subscribe(parent, args, {prisma}, info) {
        console.log(args)
        return prisma.subscription.post({
          where: {
            node: {
              published: true
            }
          }
        }, info)
      }
      // subscribe(parent, args, {db, pubsub}, info) {
      //   return pubsub.asyncIterator(`post`);
      // },
    },

    myPost: {
      subscribe(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        return prisma.subscription.post({
          where: {
            node: {
              author_id:{
                id: userId // myPost authenticated by userId,
              }
            }
          }
        }, info)
      }
    }
  };
  
  export {Subscription as default};
  