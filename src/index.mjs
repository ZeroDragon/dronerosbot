import telegramBot from 'node-telegram-bot-api'
import generateImage from './imageGenerator.mjs'

const token = process.env.TELEGRAM_TOKEN

const bot = new telegramBot(token, { polling: true })

bot.onText(/\/crear_gafete/, async (msg) => {
  const chatId = msg.chat.id

  bot.sendMessage(chatId, 'Hola, ¿cual es el nombre del acreditado?')
  const name = await new Promise((resolve) => {
    bot.once('message', (msg) => resolve(msg.text))
  })
  const user = name.toUpperCase()
  bot.sendMessage(chatId, `Recibido, ${user}. Ahora mándame su foto`)
  const photo = await new Promise((resolve) => {
    bot.once('photo', (msg) => resolve(msg.photo))
  })
  const photoId = photo.pop().file_id
  const file = await bot.getFile(photoId)
  const photoUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`

  const buffer = await generateImage(photoUrl, user)
  const messageId = await bot.sendMessage(chatId, 'Creando gafete...')

  await bot.sendPhoto(
    chatId,
    buffer,
    { caption: 'Aquí tienes tu gafete' },
    { filename: 'gafete.png', contentType: 'image/png' })

  bot.deleteMessage(chatId, messageId.message_id)
})

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Hola, soy un bot que te ayuda a crear gafetes. Para crear uno, escribe /crear_gafete.`)
})
