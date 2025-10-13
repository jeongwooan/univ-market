import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authApi';

/**
 * 인증 상태 관리를 위한 Context
 */
export const AuthContext = createContext();

/**
 * 인증 상태 관리를 위한 Provider 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 */
export const AuthProvider = ({ children }) => {
  // 사용자 정보 및 인증 상태
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 초기 로딩 시 토큰 확인 및 사용자 정보 가져오기
  useEffect(() => {
    /**
     * 로컬 스토리지의 토큰을 확인하고 사용자 정보를 로드하는 함수
     */
const loadUser = async () => {
  const token = localStorage.getItem('token');
  console.log('loadUser 실행, 토큰:', token); // 추가

  if (!token) {
    setLoading(false);
    return;
  }

  try {
    console.log('사용자 정보 요청 중...'); // 추가
    const userData = await getCurrentUser();
    console.log('받은 사용자 데이터:', userData); // 추가
    setUser(userData);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('사용자 정보 로딩 실패:', error);
    localStorage.removeItem('token');
  } finally {
    setLoading(false);
  }
};
    loadUser();
  }, []);

  /**
   * 로그인 처리 함수
   *
   * @param {string} token - JWT 토큰
   * @returns {Promise<Object>} 로그인된 사용자 정보
   */
  const login = async (token) => {
    // 토큰 저장
    localStorage.setItem('token', token);

    try {
      // 사용자 정보 가져오기
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('로그인 실패:', error);
      // 에러 발생 시 토큰 제거
      localStorage.removeItem('token');
      throw error;
    }
  };

  /**
   * 로그아웃 처리 함수
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * 사용자 정보 업데이트 함수
   *
   * @param {Object} userData - 업데이트할 사용자 정보
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  // AuthContext에 제공할 값
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
