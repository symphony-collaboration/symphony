require("dotenv").config();

const mongoose = require("mongoose");

const connectionLogSchema = mongoose.Schema({ name: String, timestamp: Date, metadata: Object }, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'seconds'
  }
});

const connectionLog = mongoose.model("connection-log", connectionLogSchema);

// commented out because it gives an error sometimes
// connectionLog.collection.createIndex({ "metadata.room": 1, "timestamp": -1 });

module.exports = connectionLog;
