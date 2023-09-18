// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'
    
const eden = edenTreaty<App>('http://localhost:8080')

await eden.user.age.patch({
    name: "saltyaom",
    age: 21
})