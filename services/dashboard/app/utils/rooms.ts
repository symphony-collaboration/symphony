import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

const getAllRooms = async () => {
  return execute(async () => {
    return client.room.findMany();
  });
};

const getActiveRooms = async () => {
  return execute(async () => {
    return client.room.findMany({ where: { active: true } });
  });
};

const execute = async (callback: Function) => {
  try {
    const data = await callback();
    await client.$disconnect();
    return data;
  } catch (error) {
    console.error(error);
    await client.$disconnect();
    process.exit(1);
  }
};

export { getAllRooms, getActiveRooms };
