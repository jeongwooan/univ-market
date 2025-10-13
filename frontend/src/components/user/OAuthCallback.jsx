import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * OAuth 콜백 처리 컴포넌트
 * 소셜 로그인 후 리다이렉트되는 페이지로, 토큰을 추출하여 로그인 처리합니다.
 */
const OAuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

// OAuthCallback.jsx에 로그 추가
useEffect(() => {
  const handleCallback = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      console.log('받은 토큰:', token); // 추가
      
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      await login(token);
      console.log('로그인 성공'); // 추가
      navigate('/');
    } catch (error) {
      console.error('OAuth 콜백 처리 중 오류:', error);
      navigate('/login');
    }
  };

  handleCallback();
}, [location, login, navigate]);

  // 로딩 중 UI 표시
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
