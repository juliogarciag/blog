import type { Handle } from 'remix/component'

import type { Post } from '../data/posts.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'

export function HomePage(handle: Handle<{ posts: Post[] }>) {
  return () => (
    <Document title="Blog">
      <h1>Blog</h1>
      <ul>
        {handle.props.posts.map((post) => (
          <li key={post.slug}>
            <time dateTime={post.date}>{post.date}</time>{' '}
            <a href={routes.posts.show.href({ slug: post.slug })}>{post.title}</a>
          </li>
        ))}
      </ul>
    </Document>
  )
}
