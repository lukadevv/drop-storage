import { Module } from '@nestjs/common';
import { FileController } from './file.controller';

export const FILE_DEST_PATH: string = './volumes/storage/files';

@Module({
  controllers: [FileController],
})
export class FileModule {}
