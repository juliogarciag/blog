import { createController } from 'remix/router'

import { listPosts } from '../data/posts.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home-page.tsx'

export default createController(routes, {
  actions: {
    home(context) {
      return context.render(<HomePage posts={listPosts()} />)
    },
  },
})
