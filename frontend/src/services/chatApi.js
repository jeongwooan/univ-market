// import api from './api';
import { api, publicApi } from './api'; // 2025/10/15 수정된 import 방식

/**
 * 사용자의 채팅방 목록을 가져오는 API
 * @returns {Promise<Array>} 채팅방 목록
 */
export const getChatRooms = async () => {
  return api.get('/chat/rooms');
};

/**
 * 특정 채팅방 정보를 가져오는 API
 * @param {number} roomId - 채팅방 ID
 * @returns {Promise<Object>} 채팅방 정보
 */
export const getChatRoomById = async (roomId) => {
  return api.get(`/chat/rooms/${roomId}`);
};

/**
 * 채팅방을 생성하는 API
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} 생성된 채팅방 정보
 */
export const createChatRoom = async (productId) => {
  return api.post('/chat/rooms', null, {
    params: { productId },
  });
};

/**
 * 채팅방의 메시지 목록을 가져오는 API
 * @param {number} roomId - 채팅방 ID
 * @returns {Promise<Array>} 메시지 목록
 */
export const getChatMessages = async (roomId) => {
  return api.get(`/chat/rooms/${roomId}/messages`);
};

/**
 * 메시지를 전송하는 API (WebSocket을 사용하지 않을 때)
 * @param {number} roomId - 채팅방 ID
 * @param {string} content - 메시지 내용
 * @returns {Promise<Object>} 전송된 메시지 정보
 */
export const sendChatMessage = async (roomId, content) => {
  return api.post(`/chat/rooms/${roomId}/messages`, {
    chatRoomId: roomId,
    content,
  });
};
