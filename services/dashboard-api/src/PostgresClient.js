const PrismaClient = require("@prisma/client").PrismaClient;
const pg = new PrismaClient();

const pgExecute = async (callback) => {
  return callback().then(async (data) => {
    await pg.$disconnect()
    return data
  })
    .catch(async (e) => {
      console.error(e)
      await pg.$disconnect()
      process.exit(1)
    });
}

module.exports = { pgExecute, pg };
