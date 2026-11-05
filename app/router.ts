import { createRouter, type RouterContext } from 'remix/router'
import { render } from 'remix/middleware/render'

import controller from './actions/controller.tsx'
import postsController from './actions/posts/controller.tsx'
import { routes } from './routes.ts'

// This app runs on Cloudflare Workers, so it leaves out Remix's asset server and
// static-file middleware: both need Node. Static files come from public/ instead.
export const router = createRouter({
  middleware: [render()],
})

export type AppContext = RouterContext<typeof router>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

router.map(routes, controller)
router.map(routes.posts, postsController)
