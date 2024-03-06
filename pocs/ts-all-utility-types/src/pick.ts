//
// Pick<Type, Keys>
//
// Constructs a type by picking the set of 
// properties Keys (string literal or union of string 
// literals) from Type.
//

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  // Object literal may only specify known properties, and 'description' does not exist in type 'TodoPreview'.ts(2353)
  // description: "test desc",
};

export function runPick():void {
    console.log("Pick<T,Ks>");
    console.log(todo);
}
