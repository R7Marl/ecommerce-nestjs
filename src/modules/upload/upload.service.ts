import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';
@Injectable()
export class UploadService {
        async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
            return new Promise<UploadApiResponse>((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    { resource_type: 'image',
                      quality: 'auto:good',
                     },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );
    
                toStream(file.buffer).pipe(upload);
            });
        }
        async getImage(public_id: string): Promise<UploadApiResponse> {
            return new Promise((resolve, reject) => {
                cloudinary.api.resource(public_id, (error, result) => error ? reject(error) : resolve(result))
            })
        }
}
