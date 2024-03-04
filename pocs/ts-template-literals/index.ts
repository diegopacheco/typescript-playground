type Getters<Type> = {
 [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;

let johnDoe:LazyPerson = {
    getName(): string {
        return "John";
    },
    getAge(): number {
        return 62;
    },
    getLocation(): string {
        return "Alaska";
    }
};
console.log(johnDoe);
console.log(johnDoe.getName());
console.log(johnDoe.getAge());
console.log(johnDoe.getLocation());