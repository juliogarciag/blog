import type { Movement, User } from "@prisma/client";
import { format } from "date-fns";
import { prisma } from "~/db.server";

function showMovement(movement: Movement) {
  return {
    ...movement,
    date: format(movement.date, "yyyy-MM-dd"),
    // We can lose precision because we're just showing the number, not manipulating it.
    amount: Number(movement.amountInCents) / 100,
    amountInCents: Number(movement.amountInCents),
    sortDiscriminator: Number(movement.sortDiscriminator),
  };
}

export async function getUserMovements(userId: User["id"]) {
  const movements = await prisma.movement.findMany({
    where: { userId },
    orderBy: [{ date: "asc" }, { sortDiscriminator: "asc" }],
  });
  return movements.map(showMovement);
}

export async function createNewMovementAfterId(movementId: Movement["id"]) {
  const movement = await prisma.movement.findUnique({
    where: { id: movementId },
    rejectOnNotFound: true,
  });
  const newMovement = await prisma.movement.create({
    data: {
      amountInCents: 0,
      date: movement.date,
      description: "new movement",
      userId: movement.userId,
      sortDiscriminator: getSortDiscriminator(movement),
    },
  });
  return newMovement;
}

export async function deleteMovementById(id: Movement["id"]) {
  if ((await prisma.movement.count({ where: { id } })) > 0) {
    return prisma.movement.delete({ where: { id } });
  }
}

export function updateMovement(id: Movement["id"], values: Partial<Movement>) {
  return prisma.movement.update({
    where: { id },
    data: values,
  });
}

export async function getNewSortDiscriminator() {
  const lastMovement = await prisma.movement.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  return getSortDiscriminator(lastMovement);
}

function getSortDiscriminator(movement: Movement | null) {
  return movement ? movement.sortDiscriminator + BigInt(1000) : BigInt(1000);
}
