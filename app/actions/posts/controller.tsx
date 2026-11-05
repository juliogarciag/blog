import { createController } from 'remix/router'

import { getPost } from '../../data/posts.ts'
import { routes } from '../../routes.ts'
import { Document } from '../../ui/document.tsx'
import { PostPage } from './post-page.tsx'

export default createController(routes.posts, {
  actions: {
    show(context) {
      let post = getPost(context.params.slug)
      if (!post) {
        return context.render(
          <Document title="Not found">
            <h1>Not found</h1>
            <p>
              <a href={routes.home.href()}>All posts</a>
            </p>
          </Document>,
          { status: 404 },
        )
      }
      return context.render(<PostPage post={post} />)
    },
  },
})
