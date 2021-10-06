/**
 * ThisType<Type>
 * This utility does not return a transformed type. 
 * Instead, it serves as a marker for a contextual this type. 
 * Note that the noImplicitThis flag must be enabled to use this utility.
 * 
 * In the example above, the methods object in the argument to makeObject has a 
 * contextual type that includes ThisType<D & M> and therefore the type of this in 
 * methods within the methods object is 
 * { x: number, y: number } & { moveBy(dx: number, dy: number): number }. 
 * Notice how the type of the methods property simultaneously is an inference 
 * target and a source for the this type in methods.
 * 
 * The ThisType<T> marker interface is simply an empty 
 * interface declared in lib.d.ts. Beyond being recognized in the 
 * contextual type of an object literal, the interface acts like any empty interface.
 * 
 */
type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}

let obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
            this.x += dx; // Strongly typed this
            this.y += dy; // Strongly typed this
        },
    },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);

export let thisTypesResult = "x: " + obj.x + " - y: " + obj.y;