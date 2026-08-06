import { Topic, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateTopicInput,
  UpdateTopicInput,
  TopicQueryFilters,
} from "./topics.types";
import { slugify } from "../../common/string";

export class TopicsRepository {
  async findAll(
    filters: TopicQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Topic[], number]> {
    const where: Prisma.TopicWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.subjectId) {
      where.subjectId = filters.subjectId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.topic.findMany({
        where,
        skip,
        take: limit,
        include: { subject: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.topic.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Topic | null> {
    return prisma.topic.findUnique({
      where: { id },
      include: { subject: true },
    });
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    return prisma.topic.findUnique({
      where: { slug },
      include: { subject: true },
    });
  }

  async findByName(name: string): Promise<Topic | null> {
    return prisma.topic.findFirst({
      where: { name },
    });
  }

  async create(data: CreateTopicInput): Promise<Topic> {
    const slug = slugify(data.name);
    return prisma.topic.create({
      data: {
        name: data.name,
        slug,
        subjectId: data.subjectId,
        description: data.description,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { subject: true },
    });
  }

  async update(id: string, data: UpdateTopicInput): Promise<Topic> {
    const updateData: Prisma.TopicUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    if (data.subjectId !== undefined) {
      updateData.subject = { connect: { id: data.subjectId } };
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.topic.update({
      where: { id },
      data: updateData,
      include: { subject: true },
    });
  }

  async delete(id: string): Promise<Topic> {
    return prisma.topic.delete({
      where: { id },
    });
  }
}
