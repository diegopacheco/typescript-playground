import { component$, useSignal, useStore, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import "../global.css";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "progress" | "done";
}

export default component$(() => {
  const tasks = useStore<{ items: Task[] }>({
    items: [
      {
        id: 1,
        title: "Setup Qwik with Bun",
        description: "Initialize project with resumable architecture and zero-hydration overhead",
        priority: "high",
        status: "done",
      },
      {
        id: 2,
        title: "Implement Resumability",
        description: "Leverage Qwik's serialization model instead of traditional hydration replay",
        priority: "high",
        status: "progress",
      },
      {
        id: 3,
        title: "Add Interactive Board",
        description: "Build a kanban board with lazy-loaded event handlers via $ syntax",
        priority: "medium",
        status: "progress",
      },
      {
        id: 4,
        title: "Fine-grained Reactivity",
        description: "Use useSignal and useStore for surgical DOM updates without re-renders",
        priority: "medium",
        status: "todo",
      },
      {
        id: 5,
        title: "Lazy Load Components",
        description: "Each component$ boundary becomes an independent chunk loaded on demand",
        priority: "low",
        status: "todo",
      },
      {
        id: 6,
        title: "Deploy with Bun Runtime",
        description: "Serve the SSR app using Bun's blazing fast HTTP server",
        priority: "low",
        status: "todo",
      },
    ],
  });

  const newTitle = useSignal("");
  const newDesc = useSignal("");
  const newPriority = useSignal<"high" | "medium" | "low">("medium");
  const nextId = useSignal(7);
  const elapsed = useSignal("0.00");

  useVisibleTask$(() => {
    const start = performance.now();
    const update = () => {
      elapsed.value = ((performance.now() - start) / 1000).toFixed(2);
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });

  const addTask = $(() => {
    if (!newTitle.value.trim()) return;
    tasks.items.push({
      id: nextId.value++,
      title: newTitle.value,
      description: newDesc.value || "No description",
      priority: newPriority.value,
      status: "todo",
    });
    newTitle.value = "";
    newDesc.value = "";
    newPriority.value = "medium";
  });

  const moveTask = $((id: number, newStatus: "todo" | "progress" | "done") => {
    const task = tasks.items.find((t) => t.id === id);
    if (task) task.status = newStatus;
  });

  const deleteTask = $((id: number) => {
    const idx = tasks.items.findIndex((t) => t.id === id);
    if (idx !== -1) tasks.items.splice(idx, 1);
  });

  const todoTasks = tasks.items.filter((t) => t.status === "todo");
  const progressTasks = tasks.items.filter((t) => t.status === "progress");
  const doneTasks = tasks.items.filter((t) => t.status === "done");

  return (
    <>
      <header class="app-header">
        <h1 class="app-title">Qwik Hydration Board</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div class="timer-display">
            <span class="timer-dot"></span>
            Resumed in {elapsed.value}s
          </div>
          <span class="hydration-badge">Resumable</span>
        </div>
      </header>

      <div class="board-container">
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Total Tasks</div>
            <div class="stat-value purple">{tasks.items.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">To Do</div>
            <div class="stat-value blue">{todoTasks.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">In Progress</div>
            <div class="stat-value amber">{progressTasks.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Completed</div>
            <div class="stat-value green">{doneTasks.length}</div>
          </div>
        </div>

        <div class="add-task-form">
          <div class="form-group" style={{ flex: 2 }}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Task title..."
              bind:value={newTitle}
            />
          </div>
          <div class="form-group" style={{ flex: 3 }}>
            <label>Description</label>
            <input
              type="text"
              placeholder="What needs to be done..."
              bind:value={newDesc}
            />
          </div>
          <div class="form-group" style={{ flex: 1 }}>
            <label>Priority</label>
            <select bind:value={newPriority}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button class="add-btn" onClick$={addTask}>
            Add Task
          </button>
        </div>

        <div class="board">
          <div class="column">
            <div class="column-header">
              <span class="column-title todo">To Do</span>
              <span class="column-count">{todoTasks.length}</span>
            </div>
            {todoTasks.length === 0 && (
              <div class="empty-column">No tasks yet</div>
            )}
            {todoTasks.map((task) => (
              <div key={task.id} class="task-card">
                <div class="task-title">{task.title}</div>
                <div class="task-desc">{task.description}</div>
                <div class="task-footer">
                  <span class={`task-tag tag-${task.priority}`}>
                    {task.priority}
                  </span>
                  <div class="task-actions">
                    <button
                      class="action-btn"
                      onClick$={() => moveTask(task.id, "progress")}
                    >
                      Start
                    </button>
                    <button
                      class="action-btn delete"
                      onClick$={() => deleteTask(task.id)}
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="column">
            <div class="column-header">
              <span class="column-title progress">In Progress</span>
              <span class="column-count">{progressTasks.length}</span>
            </div>
            {progressTasks.length === 0 && (
              <div class="empty-column">Nothing in progress</div>
            )}
            {progressTasks.map((task) => (
              <div key={task.id} class="task-card">
                <div class="task-title">{task.title}</div>
                <div class="task-desc">{task.description}</div>
                <div class="task-footer">
                  <span class={`task-tag tag-${task.priority}`}>
                    {task.priority}
                  </span>
                  <div class="task-actions">
                    <button
                      class="action-btn"
                      onClick$={() => moveTask(task.id, "todo")}
                    >
                      Back
                    </button>
                    <button
                      class="action-btn"
                      onClick$={() => moveTask(task.id, "done")}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="column">
            <div class="column-header">
              <span class="column-title done">Done</span>
              <span class="column-count">{doneTasks.length}</span>
            </div>
            {doneTasks.length === 0 && (
              <div class="empty-column">Nothing completed</div>
            )}
            {doneTasks.map((task) => (
              <div key={task.id} class="task-card">
                <div class="task-title">{task.title}</div>
                <div class="task-desc">{task.description}</div>
                <div class="task-footer">
                  <span class={`task-tag tag-${task.priority}`}>
                    {task.priority}
                  </span>
                  <div class="task-actions">
                    <button
                      class="action-btn"
                      onClick$={() => moveTask(task.id, "progress")}
                    >
                      Reopen
                    </button>
                    <button
                      class="action-btn delete"
                      onClick$={() => deleteTask(task.id)}
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class="hydration-info">
          <h3>How Qwik Resumability Works</h3>
          <p>
            <strong>Traditional frameworks</strong> download all component JS,
            re-execute every component, and re-attach every event listener on
            page load. This is <strong>hydration</strong> and it's O(n) with app size.
          </p>
          <p>
            <strong>Qwik's resumability</strong> serializes listeners, component
            boundaries, and state directly into the HTML. The browser resumes
            where the server left off with <strong>zero JS execution at startup</strong>.
            Event handlers load on-demand when users interact. This is O(1) regardless
            of app complexity.
          </p>
          <p>
            Every <strong>component$</strong> and <strong>onClick$</strong> in this
            board is a lazy-load boundary. The $ suffix tells Qwik's optimizer to
            extract it as an independent chunk. Click a button and watch the network
            tab: only that handler's code is fetched.
          </p>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik Hydration Board - Resumable App with Bun",
  meta: [
    {
      name: "description",
      content: "A kanban board built with Qwik's resumable architecture, TypeScript, and Bun runtime",
    },
  ],
};
