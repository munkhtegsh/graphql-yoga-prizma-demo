import {GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db';
import {resolvers, fragmentReplacements} from './resolvers/index';
import prisma from './prisma'

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {  // before it was just a object with {db, pubsub, prisma} changed it to method
  // console.log(request.request.headers)
    return {   // so we can access to headers
      db,
      pubsub, 
      prisma,
      request,
    }
  },
  fragmentReplacements
});

server.start({port: 4001}, () => {
  console.log('The server is up!');
});
