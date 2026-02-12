const pdf = require('pdf-parse');

const extractText = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text; // Returns raw text
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw error;
    }
};

module.exports = { extractText };