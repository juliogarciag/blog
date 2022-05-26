import type { Movement } from "@prisma/client";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { parseISO } from "date-fns";
import type { FocusEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  createNewMovementAfterId,
  deleteMovementById,
  getUserMovements,
  updateMovement,
} from "~/models/movement.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  movements: Awaited<ReturnType<typeof getUserMovements>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return json<LoaderData>({
    movements: await getUserMovements(userId),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const movementId = formData.get("movementId") as string;

  if (action === "create") {
    await createNewMovementAfterId(movementId);
  }

  if (action === "delete") {
    await deleteMovementById(movementId);
  }

  if (action === "update") {
    const { movementId, ...attributes } = getUpdateAttributes(formData);
    await updateMovement(movementId!, attributes);
  }

  return redirect("/movements");
};

function getUpdateAttributes(formData: FormData) {
  const attributes: Partial<Movement> & { movementId?: Movement["id"] } = {};

  attributes.movementId = formData.get("movementId") as string;

  const descriptionInput = formData.get("description") as string;
  if (descriptionInput !== undefined && descriptionInput !== null) {
    attributes.description = descriptionInput;
  }

  const dateInput = formData.get("date") as string;
  if (dateInput !== undefined && dateInput !== null) {
    attributes.date = parseISO(dateInput);
  }

  const amountInput = formData.get("amount") as string;
  if (amountInput !== undefined && amountInput != null) {
    attributes.amountInCents = BigInt(Number(amountInput) * 100);
  }

  return attributes;
}

export default function Movements() {
  const { movements } = useLoaderData<LoaderData>();

  return (
    <div>
      <header className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">
          <Link to=".">Movements</Link>
        </h1>
        <LogoutButton />
      </header>
      <section className="p-4">
        <div>
          <div className="grid grid-cols-movements-table p-1">
            <div className="pl-2 font-semibold">Description</div>
            <div className="pl-2 font-semibold">Date</div>
            <div className="pr-2 text-right font-semibold">Amount</div>
            <div />
          </div>
          {movements.map((movement) => {
            return <MovementRow key={movement.id} movement={movement} />;
          })}
        </div>
      </section>
    </div>
  );
}

function MovementDescription({
  movement,
}: {
  movement: LoaderData["movements"][number];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = movement.description;
    }
  }, [movement.description]);

  const submit = useSubmit();
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      submit(event.currentTarget.form);
    },
    [submit]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }
    },
    []
  );

  return (
    <Form method="post">
      <input type="hidden" name="_action" value="update" />
      <input type="hidden" name="movementId" value={movement.id} />
      <input
        type="text"
        name="description"
        ref={inputRef}
        defaultValue={movement.description}
        className="w-11/12 px-2 py-1"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </Form>
  );
}

function MovementDate({
  movement,
}: {
  movement: LoaderData["movements"][number];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = movement.date;
    }
  }, [movement.date]);

  const submit = useSubmit();
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      submit(event.currentTarget.form);
    },
    [submit]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }
    },
    []
  );

  return (
    <Form method="post">
      <input type="hidden" name="_action" value="update" />
      <input type="hidden" name="attribute" value="date" />
      <input type="hidden" name="movementId" value={movement.id} />
      <input
        type="date"
        name="date"
        ref={inputRef}
        defaultValue={movement.date}
        className="w-11/12 px-2 py-1"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </Form>
  );
}

function MovementAmount({
  movement,
}: {
  movement: LoaderData["movements"][number];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = movement.amount.toString();
    }
  }, [movement.amount]);

  const submit = useSubmit();
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      submit(event.currentTarget.form);
    },
    [submit]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }
    },
    []
  );

  return (
    <Form method="post" className="text-right">
      <input type="hidden" name="_action" value="update" />
      <input type="hidden" name="attribute" value="amount" />
      <input type="hidden" name="movementId" value={movement.id} />
      <input
        type="number"
        name="amount"
        ref={inputRef}
        defaultValue={movement.amount}
        className="w-11/12 px-2 py-1 text-right"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </Form>
  );
}

function MovementRow({
  movement,
}: {
  movement: LoaderData["movements"][number];
}) {
  return (
    <div className="grid grid-cols-movements-table items-center p-1">
      <div>
        <MovementDescription movement={movement} />
      </div>
      <div>
        <MovementDate movement={movement} />
      </div>
      <div>
        <MovementAmount movement={movement} />
      </div>
      <div className="flex space-x-2 pl-4">
        <Form method="post">
          <input type="hidden" name="_action" value="create" />
          <input type="hidden" name="movementId" value={movement.id} />
          <button
            type="submit"
            className="border px-2 py-1 text-sm text-gray-800"
          >
            Add Movement
          </button>
        </Form>
        <Form method="post">
          <input type="hidden" name="_action" value="delete" />
          <input type="hidden" name="movementId" value={movement.id} />
          <button
            type="submit"
            className="border px-2 py-1 text-sm text-gray-800"
          >
            Delete Movement
          </button>
        </Form>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <Form action="/logout" method="post">
      <button
        type="submit"
        className="rounded bg-gray-600 py-2 px-4 text-white"
      >
        Logout
      </button>
    </Form>
  );
}
