const pdf = require('pdf-parse');

 @param {Buffer} buffer 
 @returns {Promise<string>} 
/**
 * Extracts raw text from a PDF buffer.
 * @param {Buffer} buffer - The file buffer from req.files
 * @returns {Promise<string>} - The extracted text
 */
const extractText = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text; // Returns raw text
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

module.exports = { extractText };
