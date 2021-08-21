// Partial Type
interface Todo {
  title: string;
  description: string;
}
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
console.log(todo2);


// Required Type
interface Props {
  a?: number;
  b?: string;
} 
const obj: Props = { a: 5 };
const obj2: Required<Props> = { a: 5, b: "ok" };
//const obj2: Required<Props> = { a: 5 };
//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
console.log(obj2);

