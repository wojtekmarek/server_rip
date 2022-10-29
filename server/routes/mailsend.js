const sendEmailNotification = ({email, originalFilename, userFilename, pdf, filename, transactionId, sendByEmailJSA}) => {
 
    console.log('check data smtp');
    const transporter = nodemailer.createTransport({
     // SES: new AWS.SES(SESConfig)
     host: "smtp.dpoczta.pl",//"smtp.gmail.com.",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: API_USER,// API_USER, // generated ethereal user
        pass: API_PASS//API_PASS // generated ethereal password
        
      }
    });
    
    transporter.sendMail({
      from: fromEmailAddress,
      // to: `${sendReportTo}${sendByEmailJSA ? `, ${email}` : ''}`,
      //...sendByEmailJSA && {to: email},
      to:email,
      //bcc:emailrepost,
      subject: `Wynik porównania JSA-demo (ID transakcji: ${transactionId})`,
      // html: `<p>Witaj,</p><p>W załączniku znajdziesz twój raport z porównania plików:</p><p>${originalFilename}<br/>${userFilename}</p><p>ID transakcji: ${transactionId}</p><p><strong>Wesprzyj rozwój programu! Dla przyszłych roczników.</strong></p><p><a href="https://poprawaprac.pl/program-antyplagiatowy-wrona/?tid=${transactionId}&donate=true">Wpłać dowolną kwotę, a my przeznaczymy ją na dalszy rozwój systemu.</a></p>`,//. Możesz go pobrać <a href='${reportURL}'>tutaj</a>.</p>`,
      html: `<p>Witaj,</p><p>W załączniku znajdziesz twój raport z porównania plików:</p><p>${originalFilename}<br/>${userFilename}</p><p>ID transakcji: ${transactionId}</p>`,//. Możesz go pobrać <a href='${reportURL}'>tutaj</a>.</p>`,
      text: `Witaj,\r\n\r\nW załączniku znajdziesz twój raport z porównania plików:\r\n\r\n${originalFilename}\r\n${userFilename}\r\n\r\nID transakcji: ${transactionId}`,//\r\n\r\njest gotowy. Możesz go pobrać tutaj: ${reportURL}`,
      attachments: [{
        filename,
        content: pdf
      }],
   // }, (err, info*/) => {
   //  err && console.log(err);
    });
  }