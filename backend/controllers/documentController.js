const Document = require("../models/Document");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Cloudinary = require("../lib/cloudinary.js");
const multer = require("multer");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");

// Cấu hình Multer với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: Cloudinary,
    params: {
        folder: "documents",
        resource_type: "raw",
        format: async (req, file) => file.originalname.split('.').pop(), 
        public_id: (req, file) => file.originalname.replace(/\s+/g, '_') 
    },
});

const upload = multer({ storage: storage }).single("file");

const documentController = {
    // Upload file lên Cloudinary và lưu vào MongoDB
    uploadDocument: async (req, res) => {
        upload(req, res, async (err) => {
            console.log("req.file", req.file);
            console.log("req.body", req.body);
            if (err) {
                return res.status(500).json({ message: "Lỗi khi tải lên tập tin", error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng tải lên một tập tin" });
            }

            try {
                const { originalname, path } = req.file;
                const { userId } = req.body; 
                console.log("originalname", originalname);
                console.log("path", path);
                console.log("userId", userId);
            if (!userId) {
                return res.status(400).json({ message: "Trường 'userId' là bắt buộc" });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            const newDocument = new Document({
            filename: originalname,
            url: path,
            uploadedBy: user.id, // Lưu userId vào uploadedBy
            uploadedAt: new Date(),
            });

            await newDocument.save();
                
            res.status(201).json({ message: "Tải lên thành công", document: newDocument });
            } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
            }
        });
    },

    // Lấy danh sách file đã upload
    getDocuments: async (req, res) => {
        try {
            const documents = await Document.find().populate("uploadedBy", "username email");
            res.status(200).json({ documents });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Xóa file khỏi Cloudinary và MongoDB
    deleteDocument: async (req, res) => {
        try {
            const { documentId } = req.params;
            const document = await Document.findById(documentId);
            if (!document) {
                return res.status(404).json({ message: "Không tìm thấy tài liệu" });
            }

            // Xóa file trên Cloudinary
            const fileUrlParts = document.url.split("/");
            const publicId = `documents/${fileUrlParts[fileUrlParts.length - 1].split(".")[0]}`;
            await Cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            
            await Document.findByIdAndDelete(documentId);
            
            res.status(200).json({ message: "Xóa tài liệu thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = documentController;