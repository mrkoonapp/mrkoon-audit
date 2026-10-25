import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';

/**
 * Script to send E2E test report notifications to WhatsApp
 * Phone: +201023239809
 */

const phone = process.env.WHATSAPP_PHONE || '201023239809';
const status = process.env.TEST_STATUS || 'success';
const reportUrl = process.env.REPORT_URL || process.env.GITHUB_RUN_URL || '';
const branch = process.env.BRANCH || process.env.GITHUB_REF_NAME || 'staging';
const actor = process.env.GITHUB_ACTOR || 'CI/CD Bot';
const commitMsg = process.env.COMMIT_MSG || 'Merge to ' + branch;
const callmebotApiKey = process.env.CALLMEBOT_API_KEY;

const isSuccess = status === 'success' || status === 'passed';
const emoji = isSuccess ? '✅' : '❌';
const statusText = isSuccess ? 'PASSED' : 'FAILED';

const messageText = [
  `${emoji} *MRKOON E2E Test Report* ${emoji}`,
  `----------------------------------------`,
  `*Status*: ${statusText}`,
  `*Branch*: ${branch}`,
  `*Triggered By*: ${actor}`,
  `*Commit*: ${commitMsg.split('\n')[0]}`,
  `----------------------------------------`,
  reportUrl ? `🔗 *Report URL*:\n${reportUrl}` : `🔗 *Run Details*:\nhttps://github.com/${process.env.GITHUB_REPOSITORY || 'mrkoonapp/mrkoon-audit'}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`
].join('\n');

console.log('Sending WhatsApp Notification...');
console.log('Message preview:\n', messageText);

if (process.argv.includes('--dry-run')) {
  console.log('Dry run completed.');
  process.exit(0);
}

// 1. If CALLMEBOT_API_KEY is available, use CallMeBot (Free & Simple)
if (callmebotApiKey) {
  const cleanPhone = phone.replace(/^\+/, '');
  const encodedText = encodeURIComponent(messageText);
  const targetUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedText}&apikey=${callmebotApiKey}`;

  console.log(`Sending via CallMeBot to ${cleanPhone}...`);

  https.get(targetUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`CallMeBot Response Status: ${res.statusCode}`);
      console.log(`Response Body: ${data}`);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('WhatsApp notification sent successfully via CallMeBot!');
      } else {
        console.error('CallMeBot returned non-200 status.');
      }
    });
  }).on('error', (err) => {
    console.error('Error sending WhatsApp message via CallMeBot:', err.message);
  });
} 
// 2. Generic Webhook support (e.g., UltraMsg, GreenAPI, Custom Proxy, or Meta API)
else if (process.env.WHATSAPP_WEBHOOK_URL) {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const parsed = new URL(webhookUrl);
  const client = parsed.protocol === 'https:' ? https : http;

  const payload = JSON.stringify({
    phone: phone,
    to: phone,
    message: messageText,
    body: messageText,
    text: messageText,
  });

  const req = client.request(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Webhook Response Status: ${res.statusCode}`);
      console.log(`Response Body: ${data}`);
    });
  });

  req.on('error', (err) => {
    console.error('Error sending WhatsApp message via Webhook:', err.message);
  });

  req.write(payload);
  req.end();
} 
else {
  console.warn('⚠️ No CALLMEBOT_API_KEY or WHATSAPP_WEBHOOK_URL found in environment variables.');
  console.warn('Please add CALLMEBOT_API_KEY to GitHub Repository Secrets to receive WhatsApp messages.');
}
