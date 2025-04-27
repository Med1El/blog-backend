// middleware/processImageMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs/promises';

const attemptUnlink = async (filePath: string): Promise<boolean> => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return true;
        }
        console.error(`Failed to unlink: ${filePath}`, error);
        return false;
    }
};

const processImageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const processedFiles: { mainImageFilename?: string; extraSmallImageFilenames?: string[] } = {};
        const jimpUploadsPath = path.resolve(__dirname, '../../uploads/jimp');
        const saveTo = path.resolve(__dirname, '../../public/images');
        const thumbnailsSaveTo = path.resolve(__dirname, '../../public/images/thumbnails');

        await fs.mkdir(jimpUploadsPath, { recursive: true });
        await fs.mkdir(saveTo, { recursive: true });
        await fs.mkdir(thumbnailsSaveTo, { recursive: true });

        // Process mainImage
        if (req.files && (req.files as any)['mainImage'] && (req.files as any)['mainImage'][0]) {
            const mainImage = (req.files as any)['mainImage'][0];
            const filenameWithoutExt = path.parse(mainImage.filename).name;
            const mainImageFilename = `${filenameWithoutExt}.jpg`;
            const jimpFilePath = path.join(jimpUploadsPath, mainImageFilename);
            const finalImagePath = path.join(saveTo, mainImageFilename);

            try {
                const image = await Jimp.read(mainImage.path);
                await image.resize({ w: 1000 });
                await image.write(jimpFilePath as `${string}.jpg`, { quality: 70 });
                await fs.copyFile(jimpFilePath, finalImagePath);
                processedFiles.mainImageFilename = mainImageFilename;
                await attemptUnlink(mainImage.path);
                await attemptUnlink(jimpFilePath);
            } catch (error: any) {
                console.error("Error processing main image with Jimp:", error);
            }
        }

        // Process extraSmallImages
        if (req.files && (req.files as any)['extraSmallImages']) {
            const extraSmallImages = (req.files as any)['extraSmallImages'];
            const extraSmallImageFilenames: string[] = [];

            for (let i = 0; i < extraSmallImages.length; i++) {
                const image = extraSmallImages[i];
                const filenameWithoutExt = path.parse(image.filename).name;
                const thumbnailFilename = `${filenameWithoutExt}.jpg`;
                const jimpFilePath = path.join(jimpUploadsPath, thumbnailFilename);
                const finalThumbnailPath = path.join(thumbnailsSaveTo, thumbnailFilename);

                try {
                    const jimpImage = await Jimp.read(image.path);
                    await jimpImage.resize({ w: 500 });
                    await jimpImage.write(jimpFilePath as `${string}.jpg`, { quality: 60 }); // Renamed to write
                    await fs.copyFile(jimpFilePath, finalThumbnailPath);
                    extraSmallImageFilenames.push(thumbnailFilename);
                    await attemptUnlink(image.path);
                    await attemptUnlink(jimpFilePath);
                } catch (error: any) {
                    console.error(`Error processing extra small image ${i + 1} with Jimp:`, error);
                }
            }

            processedFiles.extraSmallImageFilenames = extraSmallImageFilenames;

            // Attach processed files to the request object so the controller can access them
            (req as any).processedFiles = processedFiles;
            next();

        }
    } catch (error: any) {
        console.error("Error processing images:", error);
        res.status(500).json({ message: 'Error processing images' });
    }
};

export default processImageMiddleware;