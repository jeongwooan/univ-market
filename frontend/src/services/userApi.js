// import api from './api';
import { api, publicApi } from './api'; // 2025/10/15 수정된 import 방식

/**
 * 대학교 인증 이메일을 전송하는 API
 * @param {string} email - 대학교 이메일 주소
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email) => {
  return api.post('/users/verify/send', null, {
    params: { univEmail: email },
  });
};

/**
 * 대학교 인증 코드를 확인하는 API
 * @param {Object} data - 이메일 및 인증 코드 데이터
 * @returns {Promise<boolean>} 인증 성공 여부
 */
export const verifyUnivEmail = async (data) => {
  return api.post('/users/verify/confirm', data);
};

/**
 * 사용자 프로필 정보를 가져오는 API
 * @returns {Promise<Object>} 사용자 프로필 정보
 */
export const getUserProfile = async () => {
  return api.get('/users/me');
};
