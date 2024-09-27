// types.ts
export interface Card {
  _id: string;
  index: string;
  title: string;
  description: string;
}

export interface Board {
  _id: string;
  name: string;
  todo: Card[];
  inProgress: Card[];
  done: Card[];
}
