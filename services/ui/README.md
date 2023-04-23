# Developer UI for Symphony.
Allow for viewing daily overview of average connections and active rooms over the previous 24 hours.
Data for viewing on custom timeframes, e.g 2 hours between yyyy-mm-dd xx:xx:xx UTC-X and another time could be extended with dashboard modifications.

### Static room state observation
Allows developer to verify the rooms that have been created, check their storage capacity, and get a JSON representation of all the 
Synced Types associated with a given room.

### Real-time room state observation
Allows developer view the real-time state of a given room for debugging.

## Setup
Define env variables
  - DOMAIN
  - PORT
  
Run in dev mode: `npm run dev`

OR

Rebuild project `npm run build`
Run `npm start`
