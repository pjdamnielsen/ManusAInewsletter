import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const senderEmail = process.env.SENDER_EMAIL || '';
const websiteUrl = process.env.WEBSITE_URL || '';

const resend = new Resend(resendApiKey);

export async function sendConfirmationEmail(
  email: string,
  firstName: string,
  verificationToken: string
) {
  const name = firstName || 'there';
  const verificationUrl = `${websiteUrl}/verify?token=${verificationToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Newsletter <${senderEmail}>`,
      to: [email],
      subject: 'Please confirm your newsletter subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirm Your Subscription</h2>
          <p>Hello ${name},</p>
          <p>Thank you for subscribing to our newsletter. To confirm your subscription, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4A7AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Confirm Subscription
            </a>
          </div>
          <p>If you did not request this subscription, you can safely ignore this email.</p>
          <p>This link will expire in 7 days.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">
            You're receiving this email because you signed up for our newsletter.
            If you don't want to receive these emails in the future, you can 
            <a href="${websiteUrl}/unsubscribe?token=${verificationToken}" style="color: #4A7AFF;">unsubscribe</a> at any time.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendUnsubscribeConfirmationEmail(
  email: string,
  firstName: string
) {
  const name = firstName || 'there';
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Newsletter <${senderEmail}>`,
      to: [email],
      subject: 'You have been unsubscribed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Unsubscribe Confirmation</h2>
          <p>Hello ${name},</p>
          <p>We're sorry to see you go. You have been successfully unsubscribed from our newsletter.</p>
          <p>If you unsubscribed by mistake, you can always sign up again on our website.</p>
          <p>Thank you for your interest in our content.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending unsubscribe confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending unsubscribe confirmation email:', error);
    return { success: false, error };
  }
}
