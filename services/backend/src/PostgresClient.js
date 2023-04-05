const PrismaClient = require("@prisma/client").PrismaClient;
const pg = new PrismaClient();

const pgExecute = async (callback) => {
  return callback().then(async (data) => {
    await pg.$disconnect()
    return data
  })
    .catch(async (pgError) => {
      console.error("pgExecute error", {pgError});
      await pg.$disconnect()
      return;
      // process.exit(1)
    }).catch(e => console.log("pg disconnect on pgExecute error failed"));
}

module.exports = { pgExecute, pg };
