//
// Omit<Type, Keys>
//
// Constructs a type by picking all properties from Type
// and then removing Keys (string literal or union of string
// literals). The opposite of Pick.
//
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
  // Object literal may only specify known properties, and 'description' does not exist in type 'TodoPreview'.ts(2353)
  //description: "test desc",
};

export function runOmit():void {
    console.log("Omit<T,Ks>");
    console.log(todo);
}