# Project Aulium

Project Aulium is a social network based on a modified blockchain to ensure protection from censorship and manipulation. 
All actions taken by users are trackable and can be verified to ensure they have not been tampered with.

## The currency

Since it takes hashing capacity to run a blockchain, users may opt-in to mining for Project Aulium using either dedicated mining clients or passively mining within the browser.
Mining earns Aulium, the currency used to create posts or comments. 

## Blockchain design

The blocks on the Project Aulium blockchain consist out of a JSON body containing the events submitted by users, a timestamp and a nonce.

The hashes are calculated using this simple formula: sha256(index + JSON.stringify(body) + timestamp + nonce).
The nonce may be any random data within an a-zA-Z0-9 charset, the default mining scripts simply use a randomized integer.

## Mining

Mining happens on the server itself, but slowed, to avoid situations of stuck blocks, should not enough miners be available to mine blocks.
The expected frequency of blocks being created is a 3-minute interval. This interval may be extended if the block is not filled with enough events.
Mining tasks are distributed using a websocket server by socket.io. The following events may happen:


Server -> Clients:
Name | Object
MINING_ASSIGNMENT_NEW_BLOCK | { "block_data": <data>, "index": <index>, "timestamp": <timestamp> }
MINING_ASSIGNMENT_DONE | { "index": <index> }

