import { createCanvas, loadImage } from "canvas"
import qrcode from './qrcode.mjs'
// import { writeFileSync } from 'fs'

// Dimensions for the image
const width = 2355
const height = 1875

// Instantiate the canvas object
const canvas = createCanvas(width, height)
const context = canvas.getContext("2d")

const drawImage = context => (image, x, y, width, height, angle, rounded = false) => {
  return loadImage(image).then((img) => {
    context.save()
    context.translate(x + width / 2, y + height / 2)
    context.rotate((Math.PI / 180) * angle)
    if (rounded) {
      context.beginPath()
      context.arc(0, 0, width / 2, 0, 2 * Math.PI)
      context.clip()
    }
    context.drawImage(img, -width / 2, -height / 2, width, height)
    context.restore()
  })
}
context.setImage = drawImage(context)

const addText = context => (text, side, y, bbH, fontSize = 200) => {
  context.font = `bold ${fontSize}px sans-serif`
  const textWidth = context.measureText(text).width
  const textHeight = context.measureText(text).actualBoundingBoxAscent + context.measureText(text).actualBoundingBoxDescent
  if (textWidth > width / 2 - 100) return context.addText(text, side, y, bbH, fontSize - 10)
  if (textHeight > bbH - 50) return context.addText(text, side, y, bbH, fontSize - 10)
  const column = side === 'left' ? 0 : width
  const centerX = (width / 2 - textWidth + column) / 2
  const centerY = bbH / 2 + textHeight / 2
  
  context.fillText(text, centerX, centerY + y)
}
context.addText = addText(context)

const generateImage = async (image, name) => {
  // draw background
  context.fillStyle = "#fff"
  context.fillRect(0, 0, width, height)
  await context.setImage('./images/background.png', 0, 0, width, height, 0)

  // draw user information
  await context.setImage(image, 270, 120, 630, 630, 0, true)
  context.addText(name, 'left', 850, 150)

  // add text
  context.addText("dronerosdji.realcorysback.com", 'right', 770, 150)
  context.addText('dronerosdji.realcorysback.com', 'left', 1015, 120)
  context.addText('WWW.REALCORYSBACK.COM', 'left', 1400, 150)
  context.addText('REPORTE Y VUELOS', 'left', 1540, 100)
  context.addText('URBANOS, WEB Y', 'left', 1600, 110)
  context.addText('PRENSA POR INTERNET', 'left', 1680, 100)

  context.addText('PRENSA', 'left', 1150, 250)
  // context.addText('REPORTE Y VUELOS', 'right', 1510, 100)
  // context.addText('URBANOS, WEB Y', 'right', 1570, 110)
  // context.addText('PRENSA POR INTERNET', 'right', 1650, 100)

  //draw seal
  await context.setImage('./images/seal.png', 500, 300, 700, 700, -20)
  const qrUrl = await qrcode(`https://dronerosdji.realcorysback.com`)
  await context.setImage(qrUrl, 1425, 1100, 700, 700, 0)

  // Save the image
  const buffer = canvas.toBuffer("image/png")
  // writeFileSync('gafete.png', buffer)
  return buffer
}

export default generateImage
