// import api from './api';
import { api, publicApi } from './api'; // 2025/10/15 수정된 import 방식

/**
 * 전체 상품 목록을 가져오는 API
 * @param {Object} params - 페이징 및 정렬 파라미터
 * @returns {Promise<Object>} 상품 목록 및 페이지 정보
 */
export const getAllProducts = async (params = {}) => {
  return api.get('/products', { params });
};

/**
 * 키워드로 상품을 검색하는 API
 * @param {string} keyword - 검색 키워드
 * @param {Object} params - 페이징 및 정렬 파라미터
 * @returns {Promise<Object>} 검색 결과 및 페이지 정보
 */
export const searchProducts = async (keyword, params = {}) => {
  return api.get('/products/search', {
    params: {
      keyword,
      ...params,
    },
  });
};

/**
 * 카테고리별 상품을 가져오는 API
 * @param {number} categoryId - 카테고리 ID
 * @param {Object} params - 페이징 및 정렬 파라미터
 * @returns {Promise<Object>} 상품 목록 및 페이지 정보
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  return api.get(`/products/category/${categoryId}`, { params });
};

/**
 * 상품 상세 정보를 가져오는 API
 * @param {number} id - 상품 ID
 * @returns {Promise<Object>} 상품 상세 정보
 */
// 상품 상세 정보 조회는 인증이 필요 없으므로 publicApi를 사용
export const getProductById = (id) => {
  return publicApi.get(`/products/${id}`); // 경로 수정됨
};

/**
 * 상품을 등록하는 API
 * @param {Object} productData - 등록할 상품 데이터
 * @returns {Promise<Object>} 등록된 상품 정보
 */
export const createProduct = async (productData) => {
  return api.post('/products', productData);
};

/**
 * 상품을 예약 상태로 변경하는 API
 * @param {number} id - 상품 ID
 * @returns {Promise<Object>} 업데이트된 상품 정보
 */
export const reserveProduct = async (id) => {
  return api.put(`/products/${id}/reserve`);
};

/**
 * 거래를 완료 상태로 변경하는 API
 * @param {number} id - 상품 ID
 * @returns {Promise<Object>} 업데이트된 상품 정보
 */
export const completeTransaction = async (id) => {
  return api.put(`/products/${id}/complete`);
};

/**
 * 상품을 삭제하는 API
 * @param {number} id - 상품 ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  return api.delete(`/products/${id}`);
};

/**
 * 현재 사용자의 상품 목록을 가져오는 API
 * @returns {Promise<Array>} 사용자의 상품 목록
 */
export const getUserProducts = async () => {
  return api.get('/users/me/products');
};

/**
 * 카테고리 목록을 가져오는 API
 * @returns {Promise<Array>} 카테고리 목록
 */
export const getCategories = async () => {
  return api.get('/categories');
};
