const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

// Google Cloud configuration
const keyFilename = path.join(__dirname, 'ocr-text-key.json');
const client = new vision.ImageAnnotatorClient({ keyFilename });

// Multer setup
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const filePath = path.join(__dirname, file.path);
        const imageContent = fs.readFileSync(filePath);

        // Detect text in the image
        const [result] = await client.textDetection({ image: { content: imageContent } });
        const detections = result.textAnnotations;

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json(detections.length ? detections[0].description : 'No text detected');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
