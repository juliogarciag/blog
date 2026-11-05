import { posts } from './posts.generated.ts'

export interface Post {
  slug: string
  title: string
  /** ISO date, e.g. 2026-11-05 */
  date: string
  html: string
}

export function listPosts(): Post[] {
  return posts
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}
