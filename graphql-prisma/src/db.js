// setting up some dummy data for users and posts
const users = [
  {
    id: '1',
    username: 'Potter',
  },
  {
    id: '2',
    username: 'Hermony',
  },
];

const books = [
  {
    id: '11',
    title: 'Potter defeated Voldimort',
    author: '1',
    review: '1'
  },
  {
    id: '12',
    title: 'Hermony won the contest',
    author: '2',
    review: '2'
  },
];

const reviews = [
  {
    id: '1',
    text: 'Potter wrote his FIRST review',
    rating: 4,
    book: '11',
    author: '1'
  },
  {
    id: '2',
    text: 'Hermany wrote her review',
    rating: 5,
    book: '12',
    author: '2'
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
  books,
  reviews,
};

export {db as default};
