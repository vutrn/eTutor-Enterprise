const fs = require("fs");
const path = require("path");

const fileRemover = (filename) => {
    const filePath = path.join(__dirname, "../uploads", filename);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === "ENOENT") {
                console.log(`File ${filename} doesn't exist, won't remove it.`);
            } else {
                console.error(`Error occurred while trying to remove file ${filename}: ${err.message}`);
            }
        } else {
            console.log(`Successfully removed ${filename}`);
        }
    });
};

module.exports = { fileRemover };