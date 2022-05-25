import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { createNewMovementAfterId } from "~/models/movement.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const movementId = formData.get("movementId") as string;
  await createNewMovementAfterId(movementId);
  return redirect("/movements");
};
