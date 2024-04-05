const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const shrinkImage = require('./imageShrink');
async function readExcelToJSON(filePath, imagePath) {
 return new Promise(async (resolve, reject) => {
   const workbook = XLSX.readFile(filePath);
   const sheetName = workbook.SheetNames[0];
   const worksheet = workbook.Sheets[sheetName];
   if (!worksheet) {
     reject(new Error('Excel sheet not found'));
     return;
   }
   const data = XLSX.utils.sheet_to_json(worksheet);
   const jsonData = await Promise.all(data.map(async (row, index) => {
     const { SNO, FISH, SIZE, RS, COUNT, WEIGHT, CAT } = row;
     const randomPart = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
     const timestamp = Date.now() + randomPart;
     const desc = `${FISH} - Size: ${SIZE}`; // Adjust description as needed
     const words = FISH.toLowerCase().split(' '); // Split FISH into an array of words
     
     const name = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
     const imageNumber = index + 1;
     const imagePathFull = path.join(imagePath, `${imageNumber}.jpeg`);
     let imgBase64;
     let shrinkedImage;
      try {
        imgBase64 = fs.readFileSync(imagePathFull, 'base64');
        shrinkedImage = await shrinkImage(imgBase64);
      } catch (error) {
        console.log(`Error reading image for row ${index + 1}: ${error.message}`); // Handle potential missing images
        imgBase64 = null; // Set img to null if image is missing
      }

     return {
       name,
       categories: CAT.toLowerCase().replace(/\s+/g, '-').replace(/-+$/, '')
                    .replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()),
       desc: desc.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()),
       price: RS.toString(),
       bunch: COUNT.toString(),
       defaultWeight: WEIGHT.toString(),
       size: SIZE.toString(),
       theme: "dark",
       stock: "20",
       img: shrinkedImage,
       productId: timestamp.toString()
     };
   }));
   resolve(jsonData);
 });
}
// Example usage


 module.exports = readExcelToJSON;