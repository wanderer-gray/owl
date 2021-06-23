/* Тип условия */

const WHITE = 1;
const BLACK = 2;

const types = [
  WHITE,
  BLACK,
];

const getNext = (value) => {
  const index = types.findIndex((type) => type === value);

  return types[(index + 1) % types.length];
};

const getTitle = (value) => {
  switch (value) {
    case WHITE:
      return 'WHITE';
    
    case BLACK:
      return 'BLACK';

    default:
      return null;
  }
}

export {
  WHITE,
  BLACK,

  getNext,
  getTitle,
};
