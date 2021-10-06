/**
 * Omit<Type, Keys>
 * Constructs a type by picking all properties from Type and then 
 * removing Keys (string literal or union of string literals).
 */
interface Todo {
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

export const todoOmit: TodoPreview = {
    title: "Clean room",
    completed: false,
    createdAt: 1615544252770,
};