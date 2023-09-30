import path from 'path';

export const TEST_SUIT_NAME = (filename: string): string => {
  return path.basename(filename, '.test.ts');
};
