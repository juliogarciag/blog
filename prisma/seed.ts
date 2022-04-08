import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import glob from "glob";
import path from "path";

const db = new PrismaClient();

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL ?? "";
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD ?? "";

async function seed() {
  const user = await ensureUser();
  await ensureSamplePosts(user);
  console.log(`Database has been seeded. 🌱`);
}

async function ensureUser() {
  const hashedPassword = await bcrypt.hash(SEED_USER_PASSWORD, 10);
  const userAttributes = {
    email: SEED_USER_EMAIL,
    password: {
      create: {
        hash: hashedPassword,
      },
    },
  };
  const user = await db.user.findUnique({ where: { email: SEED_USER_EMAIL } });
  if (user) {
    return await db.user.update({
      where: { id: user.id },
      data: userAttributes,
    });
  } else {
    return await db.user.create({ data: userAttributes });
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
  // 2. If no posts, create 4 sample posts out of sample markdown files.
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
