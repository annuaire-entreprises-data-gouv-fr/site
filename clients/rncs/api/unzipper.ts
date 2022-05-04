import { Siren } from '../../../utils/helpers/siren-and-siret';
import yauzl from 'yauzl';
import { HttpNotFound } from '../../exceptions';
import { logWarningInSentry } from '../../../utils/sentry';

interface IZipFileAsBuffer {
  file: string;
  buffer: Buffer;
}

/**
 * Unzip twice and returns XML
 * @param IMRBuffer
 * @param siren
 * @returns
 */
export const unzipTwiceIMR = async (
  IMRBuffer: Buffer,
  siren: Siren
): Promise<string> => {
  const unzippedIMR = await unZipFromBuffer(IMRBuffer);

  if (unzippedIMR.length > 2) {
    logWarningInSentry('More than 2 files returned in IMR zip', {
      siren,
      details: unzippedIMR.join(', '),
    });
  }

  // we assume first archive only contains one zip file
  const zippedIMRFile = unzippedIMR.find(
    (extractedFile) => extractedFile.file.indexOf('.zip') > -1
  );

  if (!zippedIMRFile) {
    throw new HttpNotFound('No IMR found');
  }

  const extractedXMLBuffer = await unZipFromBuffer(zippedIMRFile.buffer);
  return extractedXMLBuffer[0].buffer.toString();
};

const unZipFromBuffer = (buffer: Buffer): Promise<IZipFileAsBuffer[]> => {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(
      buffer,
      { autoClose: true, lazyEntries: true },
      function (err, zipfile) {
        const extractedFiles: IZipFileAsBuffer[] = [];

        if (err) {
          reject(err.message);
        } else if (zipfile === undefined) {
          reject('Could not find zipfile');
        } else {
          zipfile.readEntry();
          zipfile.on('entry', function (entry) {
            if (/\/$/.test(entry.fileName)) {
              // Directory file names end with '/'.
              // Note that entires for directories themselves are optional.
              // An entry's fileName implicitly requires its parent directories to exist.
              zipfile.readEntry();
            } else {
              try {
                // file entry
                zipfile.openReadStream(entry, function (err, readStream) {
                  const chunks: any[] = [];

                  if (err) throw err;
                  if (!readStream) throw new Error('ReadStream is undefined');

                  readStream.on('data', (chunk) => {
                    chunks.push(chunk);
                  });
                  readStream.on('end', function () {
                    extractedFiles.push({
                      file: entry.fileName,
                      buffer: Buffer.concat(chunks),
                    });
                    zipfile.readEntry();
                  });
                });
              } catch (e: any) {
                reject(e);
              }
            }
            zipfile.on('end', function () {
              resolve(extractedFiles);
            });
          });
        }
      }
    );
  });
};
