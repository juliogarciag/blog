import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import glob from "glob";
import path from "path";
import { getNewSortDiscriminator } from "~/models/movement.server";

const db = new PrismaClient();

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL ?? "";
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD ?? "";

async function seed() {
  const user = await ensureUser();
  await ensureSamplePosts(user);
  await ensureSampleMovements(user);
  console.log(`Database has been seeded. 🌱`);
}

async function ensureUser() {
  const hashedPassword = await bcrypt.hash(SEED_USER_PASSWORD, 10);
  const user = await db.user.findUnique({ where: { email: SEED_USER_EMAIL } });

  if (user) {
    return await db.user.update({
      where: { id: user.id },
      data: {
        email: SEED_USER_EMAIL,
        password: {
          update: { hash: hashedPassword },
        },
      },
    });
  } else {
    return await db.user.create({
      data: {
        email: SEED_USER_EMAIL,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });
  }
}

async function ensureSamplePosts(user: User) {
  if ((await db.post.count()) === 0) {
    const samplePostsPaths = glob.sync(
      path.join(process.cwd(), "/**/seed-data/post.*.md")
    );
    for await (const postPath of samplePostsPaths) {
      const fileContents = (await readFile(postPath)).toString();
      const [titleLine, ...contentLines] = fileContents.split("\n");

      if (titleLine.startsWith("#")) {
        const postTitle = titleLine.replace(/^#+/, "");
        const postContent = contentLines.join("\n");
        await db.post.create({
          data: {
            userId: user.id,
            title: postTitle,
            body: postContent,
          },
        });
      } else {
        console.warn(
          "Ignoring",
          postPath,
          "because it doesn't start with a title."
        );
      }
    }
  }
}

async function ensureSampleMovements(user: User) {
  if ((await db.movement.count()) === 0) {
    await db.movement.create({
      data: {
        userId: user.id,
        description: "Initial Movement",
        date: new Date(2017, 1, 1),
        amountInCents: 7947.64 * 100,
        sortDiscriminator: await getNewSortDiscriminator(),
      },
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
