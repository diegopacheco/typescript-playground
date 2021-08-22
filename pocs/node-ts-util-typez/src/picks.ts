interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo, "title">;

export const todo: TodoPreview = {
    title: "Clean room",
};
