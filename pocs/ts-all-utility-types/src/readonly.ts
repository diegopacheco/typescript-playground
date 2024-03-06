//
// Readonly<Type>
// 
// Constructs a type with all properties of Type set to readonly, 
// meaning the properties of the constructed type cannot be reassigned.
// 
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

// Cannot assign to 'title' because it is a read-only property.ts(2540)
// todo.title = "Hello";

export function runReadonly():void {
    console.log("Readonly<T>");
    console.log(todo);
}
