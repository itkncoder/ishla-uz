import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { editMessage, answerCallback } from '../lib/telegram.js'

const router = Router()

// Shared callback handler for both webhook and polling
export async function handleCallbackQuery(callback) {
  const { data, id: callbackId, message } = callback
  if (!data) return

  if (data.startsWith('kyc_')) {
    const [action, employerId] = data.split(':')
    if (!employerId) return

    const employer = await prisma.employer.findUnique({ where: { id: employerId } })
    if (!employer) {
      await answerCallback(callbackId, 'Employer not found')
      return
    }

    if (employer.kycStatus === 'verified' || employer.kycStatus === 'rejected') {
      await answerCallback(callbackId, `Already ${employer.kycStatus}`)
      return
    }

    const newStatus = action === 'kyc_accept' ? 'verified' : 'rejected'

    await prisma.employer.update({
      where: { id: employerId },
      data: { kycStatus: newStatus },
    })

    const statusEmoji = newStatus === 'verified' ? '✅' : '❌'
    const statusText = newStatus === 'verified' ? 'ACCEPTED' : 'DECLINED'
    const reviewer = callback.from?.first_name || 'Admin'

    const updatedText = [
      `🏢 *KYC ${statusText}* ${statusEmoji}`,
      ``,
      `*Company:* ${esc(employer.companyName || '—')}`,
      `*Industry:* ${esc(employer.industry || '—')}`,
      `*Country:* ${esc(employer.country || '—')}`,
      `*City:* ${esc(employer.city || '—')}`,
      ``,
      `👤 *Contact:* ${esc(employer.contactName || '—')}`,
      `📧 ${esc(employer.contactEmail || '—')}`,
      ``,
      `${statusEmoji} *${statusText}* by ${esc(reviewer)}`,
    ].join('\n')

    await editMessage(message.chat.id, message.message_id, updatedText)
    await answerCallback(callbackId, `KYC ${statusText}`)
  } else if (data.startsWith('job_')) {
    const [action, jobOrderId] = data.split(':')
    if (!jobOrderId) return

    const jobOrder = await prisma.jobOrder.findUnique({ where: { id: jobOrderId } })
    if (!jobOrder) {
      await answerCallback(callbackId, 'Job order not found')
      return
    }

    if (jobOrder.status === 'active' || jobOrder.status === 'declined') {
      await answerCallback(callbackId, `Already ${jobOrder.status}`)
      return
    }

    const newStatus = action === 'job_accept' ? 'active' : 'declined'

    await prisma.jobOrder.update({
      where: { id: jobOrderId },
      data: { status: newStatus },
    })

    const statusEmoji = newStatus === 'active' ? '✅' : '❌'
    const statusText = newStatus === 'active' ? 'ACCEPTED' : 'DECLINED'
    const reviewer = callback.from?.first_name || 'Admin'

    const title = typeof jobOrder.title === 'object' ? (jobOrder.title.en || jobOrder.title.ru || jobOrder.title.uz || '—') : (jobOrder.title || '—')
    const city = typeof jobOrder.city === 'object' ? (jobOrder.city.en || jobOrder.city.ru || jobOrder.city.uz || '—') : (jobOrder.city || '—')

    const updatedText = [
      `📋 *Job Order ${statusText}* ${statusEmoji}`,
      ``,
      `*Position:* ${esc(title)}`,
      `*Industry:* ${esc(jobOrder.industry || '—')}`,
      `*Country:* ${esc(jobOrder.country || '—')}`,
      `*City:* ${esc(city)}`,
      ``,
      `${statusEmoji} *${statusText}* by ${esc(reviewer)}`,
    ].join('\n')

    await editMessage(message.chat.id, message.message_id, updatedText)
    await answerCallback(callbackId, `Job Order ${statusText}`)
  }
}

// POST /api/telegram/webhook — handle Telegram callback queries
router.post('/webhook', async (req, res) => {
  res.sendStatus(200) // acknowledge immediately

  const callback = req.body?.callback_query
  if (!callback) return

  const { data, id: callbackId, message } = callback
  if (!data) return

  try {
    await handleCallbackQuery(callback)
  } catch (err) {
    console.error('Telegram webhook error:', err.message)
    await answerCallback(callbackId, 'Error processing request').catch(() => {})
  }
})

function esc(str) {
  return String(str).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

// GET /api/telegram/setup — set webhook (call once after deploying)
router.get('/setup', async (req, res) => {
  const host = req.query.host
  if (!host) return res.status(400).json({ message: 'Provide ?host=https://your-domain.com' })

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  if (!BOT_TOKEN) return res.status(500).json({ message: 'TELEGRAM_BOT_TOKEN not set' })

  const webhookUrl = `${host}/api/telegram/webhook`
  const result = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl }),
  }).then((r) => r.json())

  res.json({ webhookUrl, result })
})

// GET /api/telegram/chat-id — get chat ID from recent messages (send /start to bot first)
router.get('/chat-id', async (req, res) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  if (!BOT_TOKEN) return res.status(500).json({ message: 'TELEGRAM_BOT_TOKEN not set' })

  const result = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`)
    .then((r) => r.json())

  const chatIds = (result.result || [])
    .filter((u) => u.message?.chat)
    .map((u) => ({
      chatId: u.message.chat.id,
      name: u.message.chat.first_name || u.message.chat.title,
      type: u.message.chat.type,
    }))

  const unique = [...new Map(chatIds.map((c) => [c.chatId, c])).values()]
  res.json({ chatIds: unique, hint: 'Set TELEGRAM_CHAT_ID in .env to the desired chat ID' })
})

export default router
