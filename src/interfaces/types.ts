export interface States {
  name: string;
  old: number;
}

export interface Products {
  name: string;
  old: number;
}

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type HandleAfterBirthday = () => void;
