# iframe-postmessage-lost

 - Click on "Open an iframe"
 - Click on "Close the iframe"
 - When the iframe is removed, a Document "visibilitychange" event happens in the iframe
 - On the callback of that event, the iframe sends a last `postMessage()` to the parent
 - The parent should receive de message (sometimes it does not)
