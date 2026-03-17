import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosService } from './videos.service';
import { VideosResolver } from './videos.resolver';
import { Video, VideoSchema } from './video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  providers: [VideosService, VideosResolver],
  exports: [VideosService],
})
export class VideosModule {}
