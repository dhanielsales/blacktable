import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

export function Home() {
  return (
    <>
      <div className="">
        <h3>Welcome Home!</h3>
      </div>
    </>
  );
}
