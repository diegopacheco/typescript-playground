import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/code-split')({
  component: lazyRouteComponent(() => import('../components/LazyContent')),
})
