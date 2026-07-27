export async function sendWhatsAppMessage(target: string, message: string): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.warn('[WhatsApp] FONNTE_TOKEN is not set in environment variables. Message not sent.');
    return false;
  }

  // Normalize phone number to start with 62 instead of 0 if necessary
  let formattedTarget = target.trim();
  if (formattedTarget.startsWith('0')) {
    formattedTarget = '62' + formattedTarget.slice(1);
  } else if (formattedTarget.startsWith('+')) {
    formattedTarget = formattedTarget.slice(1);
  }

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedTarget,
        message: message,
      }),
    });

    const result = await response.json() as any;

    if (response.ok && result.status) {
      console.log(`[WhatsApp] Message successfully sent to ${formattedTarget}:`, result);
      return true;
    } else {
      console.error(`[WhatsApp] Failed to send message to ${formattedTarget}:`, result);
      return false;
    }
  } catch (error) {
    console.error(`[WhatsApp] Error calling Fonnte API:`, error);
    return false;
  }
}
