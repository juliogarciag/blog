import { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { throwNotFoundResponse } from "~/utils";

export function getPosts() {
  return prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function getAllPosts() {
  return prisma.post.findMany();
}

export function findPost(id: string) {
  return prisma.post.findFirst({
    where: { id },
    rejectOnNotFound: throwNotFoundResponse,
  });
}

export function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  });
}

export function createPost({
  body,
  title,
  userId,
}: Pick<Post, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updatePost(
  id: string,
  {
    body,
    title,
    userId,
  }: Pick<Post, "body" | "title"> & {
    userId: User["id"];
  }
) {
  return prisma.post.update({
    where: { id },
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
