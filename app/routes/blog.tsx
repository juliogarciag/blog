import { Link, Outlet } from "@remix-run/react";

export default function Blog() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="inline-block border-b-2 border-dashed border-yellow-500 pb-1 text-3xl font-semibold lowercase">
        <Link to="/">Julio García Gonzales</Link>
      </h1>
      <Outlet />
    </main>
  );
}
