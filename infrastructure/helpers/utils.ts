import { v4 as uuidv4 } from 'uuid';

const generateBucketName = () => {
  return `symphony-doc-store-${uuidv4()}`;
};

export { generateBucketName };
