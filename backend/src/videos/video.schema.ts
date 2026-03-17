import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Video extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop()
  duration: number;

  @Prop()
  status: string; // 'uploading', 'processing', 'completed', 'failed'

  @Prop()
  userId: string;

  @Prop({ type: [Object] })
  clips: {
    id: string;
    startTime: number;
    endTime: number;
    hook: string;
    caption: string;
    aspectRatio: string;
    url: string;
  }[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
