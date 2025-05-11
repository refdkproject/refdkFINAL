import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

export class CloudinaryService {
    static instance;

    constructor() {
        if (CloudinaryService.instance) {
            return CloudinaryService.instance;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        CloudinaryService.instance = this;
    }

    async uploadImage(file) {
        try {
            const response = await cloudinary.uploader.upload(file, {
                folder: 'VolunteerManagement',
                resource_type: 'auto',
            });

            return {
                public_id: response.public_id,
                url: response.url,
                secure_url: response.secure_url,
            };
        } catch (error) {
            console.log(error);
            return { message: `Cloudinary upload failed : ${error.message}`, http_code: 400 };
            throw new Error(`Cloudinary upload failed : ${error.message}`);
        }
    }

    async deleteMedia(publicId) {
        try {
            const response = await cloudinary.uploader.destroy(publicId);
            return response.result === 'ok';
        } catch (error) {
            throw new Error(`Cloudinary deletion failed: ${error}`);
        }
    }
}
