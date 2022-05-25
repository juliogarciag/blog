import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { deleteMovementById } from "~/models/movement.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const movementId = formData.get("movementId") as string;
  await deleteMovementById(movementId);
  return redirect("/movements");
};
