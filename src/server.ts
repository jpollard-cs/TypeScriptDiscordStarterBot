// https://replit.com/talk/learn/Hosting-discordjs-bots-on-replit-Works-for-both-discordjs-and-Eris/11027
import express from 'express';

const server = express();

server.all('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>

<p>&nbsp;</p>
<div>TODO WIRE UP TO UPTIMEROBOT TO KEEP REPLIT RUNNING</div>
</body>

</html>`);
});

function keepAlive() {
  server.listen(3042, () => {
    console.log('Server is Ready!');
  });
}

export default keepAlive;