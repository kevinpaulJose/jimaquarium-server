const sharp = require('sharp');
const shrinkImage = async function convertBase64ToWebP(base64Image) {
 const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
 const imageBuffer = Buffer.from(imageData, 'base64');
 const webpImage = await sharp(imageBuffer)
   .webp({ quality: 80 })
   .toBuffer();
 const webpBase64 = webpImage.toString('base64');
 return `data:image/webp;base64,${webpBase64}`;
}

module.exports = shrinkImage