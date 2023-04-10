### Developer UI for Symphony.
Allow for viewing daily overview of average connections and active rooms over the previous 24 hours.
Data for viewing on custom timeframes, e.g 2 hours between yyyy-mm-dd xx:xx:xx UTC-X and another time could be extended with dashboard modifications

# static room state observation
Allows developer to verify the rooms that have been created, check their storage capacity, and get a JSON representation of all the 
Synced Types associated with a given room.

# real-time room state observation
Allows developer view the real-time state of a given room. Originally attempted with SSE's, which seemed to be the ideal solution considering
that data only flows one way, from dashboard API server to client. This presented some issues, since it was an `event/text-stream` all 
data was received encoded in the dashboard api server, but then it was stringified to JSON. Considering the metadata requirements, and the 
uncompression occcuring, it seemed fairly inefficient, performed suboptimally, and yielded inconsistent results.

A much simpler and easier solution - should have gone with this one from the start - was to connect to the websocket server as another client 
and receive only state-related updates.

This allows a developer to view - in real-time - the changing synced types associated with room state, and it presents a nice UI
to view and search the ouput. This is pretty useful during the development of applications using our framework.
It provides an easy way to view the changing state, allowing the developer to determine if the room state is being modified as expected,
without having to `console.log` various outputs that may not always be easily displayed on screen.

I know during the development of the whiteboard application, this would have been a really nice addition to the development process that
would have saved me quite a bit of time.


## Setup
Redfine API endpoint and WS_URL in `app/shared/constants.ts`

Run in dev mode: `npm run dev`

OR

Rebuild project `npm run build`
Run `npm start`