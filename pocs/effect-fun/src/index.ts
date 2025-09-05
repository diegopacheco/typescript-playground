import { Effect, Console, pipe } from "effect"

interface User {
  id: number
  name: string
  email: string
}

const fetchUser = (id: number): Effect.Effect<User, Error> =>
  Effect.gen(function* () {
    yield* Console.log(`Fetching user with ID: ${id}`)
    
    if (id <= 0) {
      return yield* Effect.fail(new Error("Invalid user ID"))
    }
    
    yield* Effect.sleep("500 millis")
    
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`
    }
  })

const processUser = (user: User): Effect.Effect<string, never> =>
  Effect.gen(function* () {
    yield* Console.log(`Processing user: ${user.name}`)
    return `Processed: ${user.name} (${user.email})`
  })

const main = Effect.gen(function* () {
  yield* Console.log("Starting Effect application...")
  
  const result = yield* pipe(
    fetchUser(42),
    Effect.flatMap(processUser),
    Effect.catchAll((error) =>
      pipe(
        Console.log(`Error occurred: ${error.message}`),
        Effect.map(() => "Failed to process user")
      )
    )
  )
  
  yield* Console.log(`Result: ${result}`)
  yield* Console.log("Application completed!")
})

Effect.runPromise(main).catch(console.error)