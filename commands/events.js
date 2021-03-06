module.exports = {name: "events", run(client, msg, args) {
  client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
    if (err) { // if an error occured
      console.error(err);
      client.db.run("CREATE TABLE IF NOT EXISTS calendar (guild TEXT, events TEXT, notifs INTEGER)"); // create the table
      var bigObj = {
        list: []
      };
      var string = JSON.stringify(bigObj);
      client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, string, 1, "010010001110"], (err) => {
        if (err) {
          console.log("an error did occur");
          console.error("Events.js insertion error: ", err);
        }
        console.log("row created");
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events'`).setDescription("This server has no events.")); // insert row into table since it was just created
      });
    }

    if (!row) { // if the server does not exist in the database

      var bigObj = {
        list: []
      };
      var string = JSON.stringify(bigObj);
      client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, string, 1, "010010001110"], (err) => {
        if (err) {
          console.log("an error did not occur");
          console.error("Events.js insertion error: ", err);
        }
        console.log("row created");
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events`).setDescription("This server has no events.")); // insert row into table since it was just created
      });
    }

    else { // if the server exists in the database
      console.log(row);
      var events = JSON.parse(row.events);
      console.log(events);
        var parse = "";
        if (events === null || events.list.length <= 0) { // if there are no events
            console.log("row created");
            msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events`).setDescription("This server has no events.")); // insert row into table since it was just created
        }
        else { // if there are events
          var ids = "";
          var names = "";
          for (var i = 0; i < events.list.length; i++) {
            console.log(events.list[i]);
            var event = events.list[i];
            ids += `\n${event.id}`;
            names += `\n${event.name}`;
          }
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events`).addField("ID", ids, true).addField("Name", names, true));
        }
      }
  });
},}
