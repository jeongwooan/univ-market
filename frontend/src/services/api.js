// 2025/10/15 전체 수정 - 인증이 필요 없는 요청을 위한 별도의 axios 인스턴스(publicApi) 추가
import axios from 'axios';

// 기본 baseURL 설정
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * 인증이 필요한 요청을 위한 API 클라이언트 (기존과 동일)
 */
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 인증이 필요 없는 공개 요청을 위한 API 클라이언트 (새로 추가)
 */
const publicApi = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 'api' 인스턴스에만 인터셉터 적용
// 1. 요청 인터셉터 (토큰 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. 응답 인터셉터 (401 에러 시 로그아웃 처리)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// 'publicApi' 인스턴스에는 데이터만 반환하는 응답 인터셉터만 적용
publicApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 401 에러에 대한 자동 로그아웃 처리 없음
    return Promise.reject(error);
  },
);


// 두 개의 인스턴스를 export
export { api, publicApi };