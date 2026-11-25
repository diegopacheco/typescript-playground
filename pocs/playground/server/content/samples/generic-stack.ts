class Stack<T> {
  private readonly items: T[] = [];

  push(...values: readonly T[]): this {
    this.items.push(...values);
    return this;
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  map<U>(fn: (value: T) => U): Stack<U> {
    return new Stack<U>().push(...this.items.map(fn));
  }
}

function balanced(text: string): boolean {
  const pairs: Readonly<Record<string, string>> = { ")": "(", "]": "[", "}": "{" };
  const stack = new Stack<string>();
  for (const ch of text) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.size === 0;
}

const numbers = new Stack<number>().push(1, 2, 3);
const labels = numbers.map((n) => `#${n * 10}`);
console.log("peek number:", numbers.peek());
console.log("peek label:", labels.peek());
console.log("pop order:", [labels.pop(), labels.pop(), labels.pop(), labels.pop()]);

for (const input of ["(a[b]{c})", "(]", "{[()()]}", "(("]) {
  console.log(`${input.padEnd(10)} balanced=${balanced(input)}`);
}
