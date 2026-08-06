import { State, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateStateInput,
  UpdateStateInput,
  StateQueryFilters,
} from "./states.types";

export class StatesRepository {
  async findAll(
    filters: StateQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[State[], number]> {
    const where: Prisma.StateWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.state.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.state.count({ where }),
    ]);
  }

  async findById(id: string): Promise<State | null> {
    return prisma.state.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<State | null> {
    return prisma.state.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async findByName(name: string): Promise<State | null> {
    return prisma.state.findUnique({
      where: { name },
    });
  }

  async create(data: CreateStateInput): Promise<State> {
    return prisma.state.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: UpdateStateInput): Promise<State> {
    const updateData: Prisma.StateUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.state.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<State> {
    return prisma.state.delete({
      where: { id },
    });
  }
}
