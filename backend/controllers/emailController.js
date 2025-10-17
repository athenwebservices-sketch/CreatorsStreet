const sendMail = require('../config/mailConfig');

exports.sendEmail = async (req, res, next) => {
  try {
    const { subject, body, to,html } = req.body; // Extract subject, body, and to from the request body
    const userId = req.user._id;
    
    console.log('Send email request received for user:', userId);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('To:', to);

    // Validate input
    if (!subject || !to) {
      return res.status(400).json({
        success: false,
        message: 'Subject, body, and recipient email (to) are required.',
      });
    }

    // Create transporter for sending email (using Gmail as an example)
    // Send the email
    await sendMail({
          to: to,
          subject: subject,
          text: body,
          html: html,
        });;

    res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
    });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send email.',
      error: err.message || 'Internal server error',
    });
  }
};
