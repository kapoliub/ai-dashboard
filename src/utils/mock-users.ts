export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
  }
  
  export const mockUsers: User[] = [
    { id: 1, name: 'Alice Johnson',  email: 'alice@mail.com',  role: 'Admin'  },
    { id: 2, name: 'Bob Smith',      email: 'bob@mail.com',    role: 'Editor' },
    { id: 3, name: 'Charlie Brown',  email: 'charlie@mail.com',role: 'Viewer' },
    { id: 4, name: 'Diana Prince',   email: 'diana@mail.com',  role: 'Admin'  },
    { id: 5, name: 'Evan Wright',    email: 'evan@mail.com',   role: 'Viewer' },
  ];
  