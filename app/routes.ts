import { get, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  posts: {
    show: get('/posts/:slug'),
  },
})
