import {
  BadRequestException,
  Controller,
  Delete,
  Logger,
  Post,
  Req,
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
import * as fs from 'fs';

/**
 * Controller for file actions
 */
@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  private static LOGGER = new Logger();
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
    const paths = files.map(
      (each: any) =>
        each?.path?.replaceAll('\\', '/').replaceAll('volumes/', ''),
    );

    paths.forEach((path) =>
      FileController.LOGGER.log(`A file was created in path "${path}"`),
    );

    return paths;
  }

  /**
   * Delete a file from storage
   */
  @Delete('/delete*')
  async deleteFile(@Req() req: Request) {
    const extractedFile = req.url.replace('/file/delete', '');
    if (!req) {
      throw new BadRequestException();
    }

    const finalPath = `./volumes/${extractedFile}`;

    if (!fs.existsSync(finalPath)) {
      throw new BadRequestException();
    }

    fs.rm(finalPath, () =>
      FileController.LOGGER.log(
        `Delete file from "${extractedFile}" successfully!`,
      ),
    );

    return `Delete file from "${extractedFile}" successfully!`;
  }
}
