interface User {
  readonly id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  lastLogin?: Date;
}

type NewUser = Omit<User, "id" | "lastLogin">;
type UserPatch = Partial<Pick<User, "name" | "email" | "role">>;
type PublicUser = Readonly<Pick<User, "id" | "name">>;
type RoleCount = Record<User["role"], number>;
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

let nextId = 1;

function create(input: NewUser): User {
  return { id: `u${nextId++}`, ...input };
}

function update(user: User, patch: UserPatch): User {
  return { ...user, ...patch };
}

function toPublic(user: User): PublicUser {
  return { id: user.id, name: user.name };
}

function getters(user: PublicUser): Getters<PublicUser> {
  return { getId: () => user.id, getName: () => user.name };
}

const users: User[] = [
  create({ name: "Ada", email: "ada@mail.test", role: "admin" }),
  create({ name: "Linus", email: "linus@mail.test", role: "editor" }),
  create({ name: "Grace", email: "grace@mail.test", role: "viewer" }),
];

users[2] = update(users[2]!, { role: "editor" });

const counts: RoleCount = { admin: 0, editor: 0, viewer: 0 };
for (const user of users) {
  counts[user.role] += 1;
}

console.log("public:", users.map(toPublic));
console.log("roles:", counts);
const g = getters(toPublic(users[0]!));
console.log("getters:", g.getId(), g.getName());
type CreateReturn = ReturnType<typeof create>;
const sample: CreateReturn = create({ name: "Barbara", email: "b@mail.test", role: "viewer" });
console.log("created:", sample.id, sample.name);
