import QRCode from 'qrcode'

const qrcode = async (text) => {
  const qr = await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'L',
    type: 'image/jpeg',
    quality: 1,
    margin: 1,
    width: 700,
    color: {
      light:"#C7487FFF",
      dark:"#ffffffff"
    }
  })
  return qr
}

export default qrcode
