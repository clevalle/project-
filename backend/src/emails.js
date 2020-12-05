const db = require('./db');

exports.getEmails = async (req, res) => {
    if (req.query.from != undefined) {
      const emailsFrom = await db.getEmailsFrom(req.query.from);
      // console.log(emailsFrom);
      res.status(201).send(emailsFrom);
    } else {
      const emails = await db.selectEmails(req.query.mailbox);
      if (emails == 0) {
        res.status(404).send();
      }
      else if (emails == undefined) {
        res.status(200).json([]);
      } else {
        res.status(200).json(emails);
      }
    }
  };

exports.putEmail = async (req, res) => {
  await db.putEmail(req.params.id, req.query.unread, req.query.mailbox, req.query.starred);
  res.status(204).send();
};