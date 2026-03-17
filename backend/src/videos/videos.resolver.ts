import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VideosService } from './videos.service';
import { Video, VideoClip } from './video.model';

@Resolver(() => Video)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @Query(() => [Video])
  async videos(@Args('userId', { nullable: true }) userId: string): Promise<Video[]> {
    return this.videosService.findAll(userId || 'demo-user');
  }

  @Query(() => Video, { nullable: true })
  async video(@Args('id', { type: () => ID }) id: string): Promise<Video | null> {
    return this.videosService.findOne(id);
  }

  // Feature 1: Video Upload (drag & drop)
  @Mutation(() => Video)
  async uploadVideo(
    @Args('filename') filename: string,
    @Args('userId', { nullable: true }) userId: string,
  ): Promise<Video> {
    // In production, handle actual file upload
    return this.videosService.uploadVideo(Buffer.from(''), filename, userId || 'demo-user');
  }

  // Feature 2: AI Clip Generation with hooks
  @Mutation(() => Video)
  async generateClips(
    @Args('videoId', { type: () => ID }) videoId: string,
    @Args('numClips', { nullable: true }) numClips: number,
  ): Promise<Video> {
    return this.videosService.generateClips(videoId, numClips || 5);
  }

  // Feature 3: Caption Generation
  @Mutation(() => Video)
  async generateCaptions(
    @Args('videoId', { type: () => ID }) videoId: string,
  ): Promise<Video> {
    return this.videosService.generateCaptions(videoId);
  }

  // Feature 4: Aspect Ratio Conversion
  @Mutation(() => Video)
  async convertAspectRatio(
    @Args('videoId', { type: () => ID }) videoId: string,
    @Args('clipId', { type: () => ID }) clipId: string,
    @Args('aspectRatio') aspectRatio: string,
  ): Promise<Video> {
    return this.videosService.convertAspectRatio(videoId, clipId, aspectRatio);
  }

  // Feature 5: Bulk Export (zip download)
  @Mutation(() => ExportResult)
  async exportClips(
    @Args('videoId', { type: () => ID }) videoId: string,
  ): Promise<{ url: string; filename: string }> {
    return this.videosService.exportClips(videoId);
  }
}

@Resolver(() => VideoClip)
export class VideoClipResolver {}

export class ExportResult {
  url: string;
  filename: string;
}
