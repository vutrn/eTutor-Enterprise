const Document = require("../models/Document");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Cloudinary = require("../lib/cloudinary.js");
const multer = require("multer");
const User = require("../models/User");
const sendEmail = require("../lib/emailService");
const PersonalClass = require("../models/PersonalClass");
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
    // Upload tài liệu cho một lớp cụ thể
    uploadDocument: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi khi tải lên tập tin", error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng tải lên một tập tin" });
            }

            try {
                const { originalname, path } = req.file;
                const { userId } = req.body; 
                const { classId } = req.params; 

                if (!classId) {
                    return res.status(400).json({ message: "userId và classId là bắt buộc" });
                }

                const personalClass = await PersonalClass.findById(classId);
                if (!personalClass) {
                    return res.status(404).json({ message: "Lớp học không tồn tại" });
                }
                
                const user = await User.findById(userId);
                const newDocument = new Document({
                    filename: originalname,
                    url: path,
                    uploadedBy: user.id,
                    classId: personalClass.id, 
                    uploadedAt: new Date(),
                });

                await newDocument.save();

                res.status(201).json({ message: "Tải lên thành công", document: newDocument });
            } catch (error) {
                res.status(500).json({ message: "Lỗi server", error: error.message });
            }
        });
    },

    // Lấy danh sách file theo classId (chỉ hiển thị tài liệu của lớp đó)
    getDocuments: async (req, res) => {
        try {
            const { classId } = req.params;
            if (!classId) {
                return res.status(400).json({ message: "Trường 'classId' là bắt buộc" });
            }

            const personalClass = await PersonalClass.findById(classId);
            if (!personalClass) {
                return res.status(404).json({ message: "Lớp học không tồn tại" });
            }
    
            const documents = await Document.find({ classId }).populate("uploadedBy", "username email");
            res.status(200).json({ documents });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const { classId, documentId } = req.params;

            const document = await Document.findOne({ _id: documentId, classId });
    
            if (!document) {
                return res.status(404).json({ message: "Tài liệu không tồn tại hoặc không thuộc lớp này" });
            }
    
            // Xóa file trên Cloudinary
            const fileUrlParts = document.url.split("/");
            const publicId = `documents/${fileUrlParts[fileUrlParts.length - 1].split(".")[0]}`;
            await Cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    
            // Xóa tài liệu khỏi MongoDB
            await Document.findByIdAndDelete(documentId);
    
            res.status(200).json({ message: "Xóa tài liệu thành công" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
    
};

module.exports = documentController;