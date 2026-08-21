interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

type PartialUser = Partial<User>;
type PublicUser = Omit<User, "email" | "admin">;
type Credentials = Pick<User, "email">;
type ReadonlyUser = Readonly<User>;
type UsersById = Record<number, User>;

function patch(user: User, changes: PartialUser): User {
  return { ...user, ...changes };
}

function greeter(name: string): { greeting: string } {
  return { greeting: `hi ${name}` };
}

type GreetResult = ReturnType<typeof greeter>;

function main(): void {
  const user: User = { id: 1, name: "alice", email: "a@x.com", admin: false };

  const patched = patch(user, { name: "alice2", admin: true });
  console.log("Partial patch:", patched);

  const publicUser: PublicUser = { id: user.id, name: user.name };
  console.log("Omit:", publicUser);

  const creds: Credentials = { email: user.email };
  console.log("Pick:", creds);

  const frozen: ReadonlyUser = user;
  console.log("Readonly name:", frozen.name);

  const table: UsersById = { 1: user };
  console.log("Record lookup:", table[1].name);

  const result: GreetResult = greeter("bob");
  console.log("ReturnType:", result.greeting);
}

main();
