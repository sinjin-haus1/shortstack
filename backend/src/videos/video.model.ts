import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class VideoClip {
  @Field(() => ID)
  id: string;

  @Field()
  startTime: number;

  @Field()
  endTime: number;

  @Field()
  hook: string;

  @Field()
  caption: string;

  @Field()
  aspectRatio: string;

  @Field()
  url: string;
}

@ObjectType()
export class Video {
  @Field(() => ID)
  _id: string;

  @Field()
  filename: string;

  @Field()
  originalUrl: string;

  @Field({ nullable: true })
  duration?: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => [VideoClip], { nullable: true })
  clips?: VideoClip[];
}
