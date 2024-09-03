const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniquePrefix + '-' + file.originalname;

        req.body.fileName = fileName;
        cb(null, fileName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed!'));
        }
    }
});

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).send({ success: false, message: err.message });
    } else if (err.message === 'Invalid file type. Only JPEG, JPG and PNG are allowed!') {
        res.status(401).send({ success: false, message: err.message });
    } else if (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!' });
    }
};

module.exports = { upload, multerErrorHandler };