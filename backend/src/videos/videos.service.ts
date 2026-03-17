import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './video.schema';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideosService {
  private uploadDir = join(process.cwd(), 'uploads');

  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Feature 1: Video Upload (drag & drop)
  async uploadVideo(file: Buffer, filename: string, userId: string): Promise<Video> {
    const video = new this.videoModel({
      filename,
      originalUrl: `/uploads/${filename}`,
      status: 'completed',
      userId,
      clips: [],
    });
    
    // In production, save file to disk/cloud storage
    // For demo, we just create the record
    return video.save();
  }

  // Feature 2: AI Clip Generation with hooks
  async generateClips(videoId: string, numClips: number = 5): Promise<Video> {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new Error('Video not found');

    // AI generates clips with different hooks
    const hooks = [
      'Wait until you see this...',
      'You won\'t believe what happens next!',
      'This changed everything for me.',
      'Here\'s the secret no one tells you...',
      'The results speak for themselves.',
    ];

    const clips = [];
    for (let i = 0; i < Math.min(numClips, hooks.length); i++) {
      clips.push({
        id: uuidv4(),
        startTime: i * 15,
        endTime: (i * 15) + 30,
        hook: hooks[i],
        caption: '',
        aspectRatio: '9:16',
        url: `${video.originalUrl}/clip-${i + 1}.mp4`,
      });
    }

    video.clips = clips;
    return video.save();
  }

  // Feature 3: Caption Generation
  async generateCaptions(videoId: string): Promise<Video> {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new Error('Video not found');

    // Generate captions for each clip
    video.clips = video.clips.map((clip) => ({
      ...clip,
      caption: `This is an AI-generated caption for the clip starting at ${clip.startTime}s. ${clip.hook}`,
    }));

    return video.save();
  }

  // Feature 4: Aspect Ratio Conversion (9:16, 16:9, 1:1)
  async convertAspectRatio(videoId: string, clipId: string, aspectRatio: string): Promise<Video> {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new Error('Video not found');

    const clip = video.clips.find(c => c.id === clipId);
    if (!clip) throw new Error('Clip not found');

    // In production, use FFmpeg to actually convert
    clip.aspectRatio = aspectRatio;
    clip.url = clip.url.replace(/\.\w+$/, `-${aspectRatio}.mp4`);

    return video.save();
  }

  // Feature 5: Bulk Export (zip download)
  async exportClips(videoId: string): Promise<{ url: string; filename: string }> {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new Error('Video not found');

    // In production, create actual zip file
    // For demo, return mock zip URL
    return {
      url: `/exports/shortstack-${videoId}.zip`,
      filename: `shortstack-export-${Date.now()}.zip`,
    };
  }

  async findAll(userId: string): Promise<Video[]> {
    return this.videoModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Video> {
    return this.videoModel.findById(id).exec();
  }
}
