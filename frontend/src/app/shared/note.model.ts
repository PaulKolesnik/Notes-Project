export class Note {
      public title: string;
      public priority: Priorities;
      public body: string;
}

export enum Priorities {
      Low = 1,
      Normal = 2,
      High = 3
}