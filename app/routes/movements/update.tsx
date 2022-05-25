import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { parseISO } from "date-fns";
import { updateMovement } from "~/models/movement.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const movementId = formData.get("movementId") as string;
  const attribute = formData.get("attribute");

  if (attribute === "description") {
    const description = formData.get("description") as string;
    await updateMovement(movementId, { description });
  }

  if (attribute === "date") {
    const dateInput = formData.get("date") as string;
    const date = parseISO(dateInput);
    await updateMovement(movementId, { date });
  }

  if (attribute === "amount") {
    const amountInput = formData.get("amount") as string;
    const amount = Number(amountInput);
    await updateMovement(movementId, { amountInCents: BigInt(amount * 100) });
  }

  return redirect("/movements");
};
