function formatSalary(value) {
  if (!value && value !== 0) return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function tgFetch(method, body) {
  if (!BOT_TOKEN) return null
  try {
    const res = await fetch(`${API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  } catch (err) {
    console.error('Telegram error:', err.message)
    return null
  }
}

export async function sendKycNotification(employer) {
  if (!CHAT_ID) {
    console.warn('TELEGRAM_CHAT_ID not set — skipping notification')
    return
  }

  const text = [
    `🏢 *New KYC Submission*`,
    ``,
    `*Company:* ${esc(employer.companyName || '—')}`,
    `*Industry:* ${esc(employer.industry || '—')}`,
    `*Country:* ${esc(employer.country || '—')}`,
    `*City:* ${esc(employer.city || '—')}`,
    ``,
    `👤 *Contact Person*`,
    `*Name:* ${esc(employer.contactName || '—')}`,
    `*Phone:* ${esc(employer.contactPhone || '—')}`,
    `*Email:* ${esc(employer.contactEmail || '—')}`,
    `*Position:* ${esc(employer.contactPosition || '—')}`,
    ``,
    `📎 License: ${employer.businessLicensePath ? '✅ Uploaded' : '❌ Not uploaded'}`,
    `📎 Cert: ${employer.registrationCertPath ? '✅ Uploaded' : '❌ Not uploaded'}`,
    ``,
    `🆔 \`${employer.id}\``,
  ].join('\n')

  return tgFetch('sendMessage', {
    chat_id: CHAT_ID,
    text,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Accept', callback_data: `kyc_accept:${employer.id}` },
          { text: '❌ Decline', callback_data: `kyc_decline:${employer.id}` },
        ],
      ],
    },
  })
}

export async function sendJobOrderNotification(jobOrder) {
  if (!CHAT_ID) {
    console.warn('TELEGRAM_CHAT_ID not set — skipping notification')
    return
  }

  const title = typeof jobOrder.title === 'object' ? (jobOrder.title.en || jobOrder.title.ru || jobOrder.title.uz || '—') : (jobOrder.title || '—')
  const city = typeof jobOrder.city === 'object' ? (jobOrder.city.en || jobOrder.city.ru || jobOrder.city.uz || '—') : (jobOrder.city || '—')
  const salaryText = typeof jobOrder.salary === 'object' ? (jobOrder.salary.amount ? `${formatSalary(jobOrder.salary.amount)} ${jobOrder.salary.currency || ''}`.trim() : '—') : (jobOrder.salary || '—')
  const desc = typeof jobOrder.description === 'object' ? (jobOrder.description.en || jobOrder.description.ru || jobOrder.description.uz || '—') : (jobOrder.description || '—')

  const text = [
    `📋 *New Job Order*`,
    ``,
    `*Position:* ${esc(title)}`,
    `*Industry:* ${esc(jobOrder.industry || '—')}`,
    `*Country:* ${esc(jobOrder.country || '—')}`,
    `*City:* ${esc(city)}`,
    `*Salary:* ${esc(salaryText)}`,
    ``,
    `📝 *Description:* ${esc(desc.length > 200 ? desc.slice(0, 200) + '...' : desc)}`,
    ``,
    `🆔 \`${jobOrder.id}\``,
  ].join('\n')

  return tgFetch('sendMessage', {
    chat_id: CHAT_ID,
    text,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Accept', callback_data: `job_accept:${jobOrder.id}` },
          { text: '❌ Decline', callback_data: `job_decline:${jobOrder.id}` },
        ],
      ],
    },
  })
}

export async function editMessage(chatId, messageId, text) {
  return tgFetch('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'Markdown',
  })
}

export async function answerCallback(callbackQueryId, text) {
  return tgFetch('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  })
}

function esc(str) {
  return String(str).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

// --- Polling mode for local development (no webhook needed) ---

let lastUpdateId = 0

async function getUpdates() {
  if (!BOT_TOKEN) return []
  try {
    const res = await fetch(`${API}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`)
    const data = await res.json()
    return data.result || []
  } catch {
    return []
  }
}

export async function startPolling(handleCallback) {
  // Delete any existing webhook so polling works
  await tgFetch('deleteWebhook', {})
  console.log('🤖 Telegram polling started (dev mode)')

  const poll = async () => {
    const updates = await getUpdates()
    for (const update of updates) {
      lastUpdateId = update.update_id
      if (update.callback_query) {
        await handleCallback(update.callback_query)
      }
    }
    setTimeout(poll, 1000)
  }
  poll()
}
