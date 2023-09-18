// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/age',
        ({ body }) => {
            console.log("got request " + body)
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )
    .listen(8080)
    
export type App = typeof app