// import api from './api';
import { api, publicApi } from './api'; // 2025/10/15 수정된 import 방식

/**
 * 현재 로그인된 사용자 정보를 가져오는 API
 * @returns {Promise<Object>} 사용자 정보
 */
export const getCurrentUser = async () => {
  return api.get('/users/me');
};

/**
 * 로그아웃 처리
 * 로컬 스토리지에서 토큰을 제거합니다.
 */
export const logout = () => {
  localStorage.removeItem('token');
};
