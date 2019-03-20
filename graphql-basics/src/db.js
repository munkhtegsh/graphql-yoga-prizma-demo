// setting up some dummy data for users and posts
//
const users = [
  {
    id: '1',
    name: 'Potter',
    email: 'potter@gmail.com',
    password: 'jkfdsjfssd',
  },
  {
    id: '2',
    name: 'Hermony',
    email: 'hermony@yahoo.com',
    password: 'erewwaq',
  },
];

const posts = [
  {
    id: '10',
    title: 'Potter defeated Voldimort',
    body: 'Blalallalala ....',
    published: true,
    author_id: '1',
  },
  {
    id: '11',
    title: 'Hermony won the contest',
    body: 'Wooohooo....',
    published: false,
    author_id: '2',
  },
];

const comments = [
  {
    id: '1',
    text: 'Potter wrote his FIRST comment',
    author_id: '1',
    post_id: '10',
  },
  {
    id: '2',
    text: 'Potter wrote his SECOND comment',
    author_id: '1',
    post_id: '11',
  },
  {
    id: '3',
    text: 'Hermony wrote her FIRST comment',
    author_id: '2',
    post_id: '10',
  },
  {
    id: '4',
    text: 'Hermony wrote her SECOND comment',
    author_id: '2',
    post_id: '11',
  },
];

const db = {
  users,
  posts,
  comments,
};

export {db as default};
