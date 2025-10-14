// import api from './api';
import { api, publicApi } from './api'; // 2025/10/15 수정된 import 방식

/**
 * S3 Presigned URL을 발급받는 API
 * 클라이언트에서 직접 S3에 파일을 업로드할 수 있는 URL을 제공합니다.
 *
 * @param {string} fileName - 업로드할 파일 이름
 * @param {string} contentType - 파일 MIME 타입
 * @returns {Promise<Object>} 업로드 URL 및 최종 파일 URL
 */
export const getPresignedUrl = async (fileName, contentType) => {
  return api.post('/upload/url', null, {
    params: {
      fileName,
      contentType,
    },
  });
};
