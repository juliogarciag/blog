import { router } from './app/router.ts'

export default {
  fetch(request: Request) {
    return router.fetch(request)
  },
}
