import {
  BadRequestException,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/security/guards/auth.guard';
import {
  DiskStorage,
  FilesInterceptor,
  MemoryStorageFile,
  UploadFilterFile,
  UploadOptions,
  UploadedFiles,
} from '@blazity/nest-file-fastify';

/**
 * Controller for file actions
 */
@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  /**
   * Upload files via this endpoint
   *
   * @param files files to upload
   * @returns created files internal path
   */
  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('files', 15, {
      dest: './volumes/storage/files',
      storage: new DiskStorage(),
      filter: async (
        uploadOptions: UploadOptions,
        req: any,
        file: UploadFilterFile,
      ): Promise<boolean> => {
        if (uploadOptions.filter == null) {
          return true;
        }

        try {
          const res = await uploadOptions.filter(req, file);

          if (typeof res === 'string') {
            throw new BadRequestException(res);
          }

          return res;
        } catch (error) {
          await uploadOptions.storage!.removeFile(file, true);
          throw error;
        }
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: MemoryStorageFile[]) {
    return files.map((each: any) => each?.path?.replaceAll('\\', '/'));
  }
}
