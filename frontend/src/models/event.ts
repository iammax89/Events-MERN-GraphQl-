export interface IEventInput {
  title: string;
  describtion: string;
  price: number;
  date: string;
}

export type FetchedEvent = IEventInput & { _id: string } & {
  creator: {
    _id: string;
  };
};
