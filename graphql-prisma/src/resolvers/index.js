import {extractFragmentReplacements} from 'prisma-binding'
import Comment from './Comment';
import Mutation from './Mutation';
import Post from './Post';
import Query from './Query';
import User from './User';
import Subscription from './Subscription'

const resolvers = {
    Comment,
    Mutation,
    Post,
    Query,
    User,
    Subscription,
  } 

// set it up due to use fragment and import to Prisma.js and index.js
const fragmentReplacements = extractFragmentReplacements(resolvers)
console.log(fragmentReplacements)

export {resolvers, fragmentReplacements}