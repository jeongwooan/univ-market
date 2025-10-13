import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { reserveProduct, completeTransaction } from '../../services/productApi';
import { createChatRoom } from '../../services/chatApi';

/**
 * 상품 상세 정보를 표시하는 컴포넌트
 * 상품 이미지, 설명, 가격, 판매자 정보 및 거래 관련 버튼을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.product - 표시할 상품 상세 정보
 * @param {boolean} props.isLoading - 로딩 상태 여부
 * @param {string} props.error - 에러 메시지
 */
const ProductDetail = ({ product, isLoading, error }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // 이미지 캐러셀을 위한 현재 이미지 인덱스
  const [currentImage, setCurrentImage] = useState(0);
  // 상품 예약 및 거래 완료 처리 상태
  const [isReserving, setIsReserving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러가 있을 때 표시할 UI
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  // 상품 정보가 없을 때 표시할 UI
  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  /**
   * 채팅방 생성 및 이동 함수
   */
const handleChat = async () => {
  console.log('=== 채팅방 생성 디버깅 ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('product.id:', product.id);
  console.log('token:', localStorage.getItem('token'));

  if (!isAuthenticated || !user) {
    alert('로그인이 필요합니다.');
    navigate('/login');
    return;
  }

  try {
    console.log('API 호출 시작...');
    const chatRoom = await createChatRoom(product.id);
    console.log('채팅방 생성 성공:', chatRoom);
    navigate(`/chat?roomId=${chatRoom.id}`);
  } catch (error) {
    console.log('=== 에러 상세 정보 ===');
    console.log('Error:', error);
    console.log('Response:', error.response);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    
    alert(`채팅방 생성 실패: ${error.response?.data?.message || error.message}`);
  }
};

  /**
   * 상품 예약 처리 함수
   */
  const handleReserve = async () => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 사용자 확인
    if (!window.confirm('이 상품을 예약하시겠습니까?')) {
      return;
    }

    setIsReserving(true);
    try {
      // 예약 API 호출
      await reserveProduct(product.id);
      // 페이지 새로고침으로 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error('상품 예약 중 오류 발생:', error);
      alert('상품을 예약할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsReserving(false);
    }
  };

  /**
   * 거래 완료 처리 함수
   */
  const handleComplete = async () => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 사용자 확인
    if (!window.confirm('거래를 완료하시겠습니까?')) {
      return;
    }

    setIsCompleting(true);
    try {
      // 거래 완료 API 호출
      await completeTransaction(product.id);
      // 페이지 새로고침으로 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error('거래 완료 중 오류 발생:', error);
      alert('거래를 완료할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsCompleting(false);
    }
  };

  // 판매자 본인 여부 확인
  const isSeller = user && user.id === product.sellerId;

  // 구매자 본인 여부 확인 (예약된 경우)
  const isBuyer = user && product.status === 'RESERVED' && user.id === product.buyerId;

  /**
   * 상품 상태에 따른 액션 버튼을 렌더링하는 함수
   * 판매자, 구매자, 일반 사용자별로 다른 버튼을 표시
   */
  const renderActionButtons = () => {
    // 판매 완료된 상품인 경우
    if (product.status === 'COMPLETED') {
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="font-medium text-gray-700">이 상품은 판매가 완료되었습니다.</p>
        </div>
      );
    }

    // 판매자인 경우
    if (isSeller) {
      if (product.status === 'RESERVED') {
        return (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            {isCompleting ? '처리 중...' : '거래 완료'}
          </button>
        );
      }
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="font-medium text-gray-700">내가 등록한 상품입니다.</p>
        </div>
      );
    }

    // 예약 중이고 구매자인 경우
    if (product.status === 'RESERVED' && isBuyer) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-center text-gray-700">이 상품은 내가 예약 중입니다.</p>
          <button
            onClick={handleChat}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            판매자와 채팅하기
          </button>
        </div>
      );
    }

    // 일반 사용자일 경우 (판매중일 때)
    if (product.status === 'WAITING') {
      return (
        <div className="space-y-2">
          <button
            onClick={handleReserve}
            disabled={isReserving}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none disabled:bg-green-300"
          >
            {isReserving ? '처리 중...' : '예약하기'}
          </button>
          <button
            onClick={handleChat}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            판매자와 채팅하기
          </button>
        </div>
      );
    }

    // 예약 중이고 구매자가 아닌 경우
    if (product.status === 'RESERVED') {
      return (
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <p className="font-medium text-yellow-700">이 상품은 현재 예약 중입니다.</p>
        </div>
      );
    }

    return null;
  };

  /**
   * 다음 이미지로 이동하는 함수
   */
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.imageUrls.length);
  };

  /**
   * 이전 이미지로 이동하는 함수
   */
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="md:flex">
        {/* 상품 이미지 */}
        <div className="md:w-1/2 p-4">
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <div className="relative">
              {/* 메인 이미지 */}
              <img
                src={product.imageUrls[currentImage]}
                alt={product.title}
                className="w-full h-96 object-contain border rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/default-product.png';
                }}
              />

              {/* 이미지가 2개 이상일 경우 좌우 네비게이션 버튼 표시 */}
              {product.imageUrls.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between">
                  <button
                    onClick={handlePrevImage}
                    className="bg-white bg-opacity-50 p-2 rounded-full ml-2 hover:bg-opacity-75"
                  >
                    ◀
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="bg-white bg-opacity-50 p-2 rounded-full mr-2 hover:bg-opacity-75"
                  >
                    ▶
                  </button>
                </div>
              )}

              {/* 이미지 인디케이터 (여러 이미지가 있을 경우) */}
              {product.imageUrls.length > 1 && (
                <div className="mt-2 flex justify-center">
                  {product.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-3 h-3 mx-1 rounded-full ${
                        index === currentImage ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // 이미지가 없을 경우 기본 UI
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <p className="text-gray-500">이미지가 없습니다</p>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="md:w-1/2 p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              {/* 상품 제목 */}
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              {/* 상품 상태 배지 */}
              <span
                className={`px-3 py-1 text-sm font-bold text-white rounded-full ${
                  product.status === 'WAITING'
                    ? 'bg-green-500'
                    : product.status === 'RESERVED'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
              >
                {product.status === 'WAITING'
                  ? '판매중'
                  : product.status === 'RESERVED'
                  ? '예약중'
                  : '판매완료'}
              </span>
            </div>
            {/* 상품 가격 */}
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {formatPrice(product.price)}원
            </p>
          </div>

          {/* 상품 메타 정보 */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-24">카테고리</span>
              <span>{product.categoryName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-24">판매자</span>
              <span>{product.sellerNickname}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-24">등록일</span>
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">상품 설명</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="mt-6">{renderActionButtons()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
