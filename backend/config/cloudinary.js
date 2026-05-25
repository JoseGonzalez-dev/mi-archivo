import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Determinar si es un archivo crudo (documentos)
        const format = file.originalname.split('.').pop().toLowerCase();
        let resource_type = 'auto';
        
        // Cloudinary maneja pdf, docx, xlsx como 'raw'
        if (['pdf', 'docx', 'xlsx', 'txt', 'csv'].includes(format)) {
            resource_type = 'raw';
        }

        return {
            folder: 'mi-archivo',
            resource_type: resource_type
        };
    }
})

export const upload = multer({ storage })
