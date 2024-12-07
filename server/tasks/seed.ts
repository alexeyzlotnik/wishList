export default defineTask({
   meta: {
     name: 'db:seed',
     description: 'Run database seed task'
   },
   async run() {
     console.log('Running DB seed task...')
     const users = [
       {
         name: 'John Doe',
         email: 'john@example.com',
         avatar: 'https://example.com/avatar/john.png',
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         verifiedAt: new Date().toISOString()
       },
       {
         name: 'Jane Doe',
         email: 'jane@example.com',
         avatar: 'https://example.com/avatar/jane.png',
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         verifiedAt: new Date().toISOString()
       }
     ]
     await useDrizzle().insert(tables.users).values(users)
     return { result: 'success' }
   }
 })
