const sg = require("@sendgrid/mail");
const api = process.env.API;
sg.setApiKey(api);
const PDFDocument = require("pdfkit");
const fs = require("fs");
const sendWelcomeEmail = async (email, name, password, dob, res) => {
  let arr = dob.split("-");
  
  const options = {
    userPassword: arr[0] + arr[1] + arr[2],
  };
  // console.log(options.userPassword)
  const doc = new PDFDocument(options);
  const writeStream = fs.createWriteStream(`${name}.pdf`);

  doc.text(`LoginId : ${email}.\nPassword: ${password}.`);

  doc.end();

  doc.pipe(writeStream);

  writeStream.on("finish", () => {
    fs.readFile(`${name}.pdf`, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(data,"\n")
        const msg = {
          to: email,
          from: "shobhitchoudhary745@gmail.com",
          subject: "Sending a Welcome Email!",
          text: `Welcome ${name}, Thankyou for join us. Please find an attachment below which contain your login credentials. Attachment is password protected. Use your dob in ddmmyyyy format to open it.`,
          attachments: [
            {
              content: data.toString("base64"),
              filename: `${name}.pdf`,
              path: `${name}.pdf`,
              encoding: "base64",
            },
          ],
        };

        try {
          await sg.send(msg);
          // res.send('Email sent successfully');
          fs.unlink(`${name}.pdf`, (err) => {});
        } catch (error) {
          console.log(error);
          res.send("Error");
        }
      }
    });
  });
};

module.exports = {
  sendWelcomeEmail,
};
