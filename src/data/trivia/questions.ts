import { nanoid } from 'nanoid';
import TriviaCategory from './categories';

const questions = [
  {
    categories: ['CRYPTO'],
    text: 'What is the best NFT project?',
    fakeAnswers: [
      'CryptoPunks',
      'CyberKongz',
      'MekaVerse',
      'Claylings',
    ],
    correctAnswer: 'HAPEBEAST',
  },
  {
    categories: ['RANDOM'],
    text: 'Do you like me?',
    fakeAnswers: [
      'Maybe',
      'No',
    ],
    correctAnswer: 'Yes',
  },
] as ({
  categories: TriviaCategory,
  text: string,
  fakeAnswers: string[],
  correctAnswer: string,
  isMultipleChoice: boolean,
}[]);

// todo: could have discriminated union type to create all sorts of question types
// and have different handlers for e.g. weighted questions (some answers are more right than others),
// functional questions where a function can be used to determine which one is right based on which inputs were provided
// ordered questions based on things like chronological order perhaps?

export default questions.map(q => ({
  ...q,
  fakeAnswers: q.fakeAnswers.map(a => ({ id: nanoid(), value: a })),
  correctAnswer: { id: nanoid(), value: q.correctAnswer },
  id: nanoid(),
}));