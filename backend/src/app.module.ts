import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    // MongoDB connection (optional - using in-memory for demo)
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/shortstack'),
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    
    VideosModule,
  ],
})
export class AppModule {}
