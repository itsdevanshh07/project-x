const { PDFDocument, rgb, degrees } = require('pdf-lib');
const axios = require('axios');

const watermarkPDF = async (pdfUrl, userInfo) => {
    try {
        // Fetch the PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfDoc = await PDFDocument.load(response.data);
        const pages = pdfDoc.getPages();

        for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(`Licensed to: ${userInfo.email} | ${userInfo.fullName}`, {
                x: 50,
                y: height - 50,
                size: 10,
                color: rgb(0.5, 0.5, 0.5),
                opacity: 0.5,
            });

            // Diagonal watermark
            page.drawText(userInfo.email, {
                x: width / 4,
                y: height / 2,
                size: 30,
                color: rgb(0.8, 0.8, 0.8),
                opacity: 0.2,
                rotate: degrees(45),
            });
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('PDF Watermark Error:', error);
        throw error;
    }
};

module.exports = { watermarkPDF };
