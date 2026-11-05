import type { Handle } from 'remix/component'
import { unsafeHTML } from 'remix/component'

import type { Post } from '../../data/posts.ts'
import { routes } from '../../routes.ts'
import { Document } from '../../ui/document.tsx'

export function PostPage(handle: Handle<{ post: Post }>) {
  return () => {
    let { post } = handle.props
    return (
      <Document title={post.title}>
        <p>
          <a href={routes.home.href()}>All posts</a>
        </p>
        <h1>{post.title}</h1>
        <p>
          <time dateTime={post.date}>{post.date}</time>
        </p>
        {/* post.html is rendered from our own Markdown files at build time, so it is trusted. */}
        <article innerHTML={unsafeHTML(post.html)} />
      </Document>
    )
  }
}
