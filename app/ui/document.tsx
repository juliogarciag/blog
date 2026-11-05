import type { Handle, RemixNode } from 'remix/component'

export function Document(handle: Handle<{ title: string; children?: RemixNode }>) {
  return () => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>{handle.props.title}</title>
        <link rel="stylesheet" href="/site.css" />
      </head>
      <body>{handle.props.children}</body>
    </html>
  )
}
