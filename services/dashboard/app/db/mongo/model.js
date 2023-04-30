import mongoose from 'mongoose';
import * as dotenv from 'dotenv'


dotenv.config()

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

export default connectionLog
