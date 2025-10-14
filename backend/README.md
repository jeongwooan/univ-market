# 대학마켓 백엔드

## 대학생들을 위한 안전한 중고거래 플랫폼 '대학마켓'의 백엔드 프로젝트입니다.

---

### 기술 스택

##### Java 17 (JDK 17.0.14)

##### Spring Boot

##### Spring Data JPA

##### Spring Security

##### MariaDB 12.0.2

##### OAuth 2.0 (카카오 로그인)

##### WebSocket (STOMP)

##### AWS S3 (이미지 저장)

##### JWT (인증)

---

### 주요 기능

#### 사용자 관리

1. 카카오 소셜 로그인
2. 대학교 이메일을 통한 인증
3. JWT 기반 인증

#### 상품 거래

1. 상품 등록/조회/수정/삭제
2. 이미지 업로드 (AWS S3)
3. 상품 검색 및 카테고리별 필터링
4. 거래 상태 관리 (판매중 → 예약중 → 판매완료)

#### 실시간 채팅

1. WebSocket을 활용한 실시간 메시지 교환
2. 채팅방 생성 및 관리
3. 메시지 영구 저장

#### 알림 기능

1. 상품 등록, 예약, 거래 완료 시 이메일 알림

---

### 시작하기

#### 사전 요구사항

1. Java 17 이상
2. Gradle
3. MariaDB 12.0.2
4. AWS 계정 (S3 사용)
5. 카카오 개발자 계정 (OAuth 사용)

---

### 설치 및 설정

#### 프로젝트 클론

```
git clone https://github.com/JeongwooAn/univ-market.git
```

```
cd univ-market
```

#### 프로젝트 빌드

```
./gradlew build
```

```
./gradlew build -x test
```

#### API 문서

애플리케이션 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

#### Swagger UI: http://localhost:8080/swagger-ui/index.html

---

### 프로젝트 구조

```
com.univ.market
├── config // 설정 관련 클래스
│ ├── SecurityConfig.java
│ ├── WebSocketConfig.java
│ └── S3Config.java
├── controller // API 컨트롤러
│ ├── ProductController.java
│ ├── UserController.java
│ ├── CategoryController.java
│ └── ChatController.java
├── domain // 도메인 엔티티
│ ├── Product.java
│ ├── Category.java
│ ├── User.java
│ ├── Image.java
│ ├── ChatRoom.java
│ ├── ChatMessage.java
│ └── UnivVerification.java
├── dto // 데이터 전송 객체
│ ├── request
│ │ ├── ProductRequest.java
│ │ ├── ChatMessageRequest.java
│ │ └── UnivVerificationRequest.java
│ └── response
│ ├── ProductResponse.java
│ ├── CategoryResponse.java
│ └── ChatMessageResponse.java
├── repository // JPA 리포지토리
│ ├── ProductRepository.java
│ ├── CategoryRepository.java
│ ├── UserRepository.java
│ ├── ImageRepository.java
│ ├── ChatRoomRepository.java
│ └── ChatMessageRepository.java
├── service // 비즈니스 로직
│ ├── ProductService.java
│ ├── UserService.java
│ ├── CategoryService.java
│ ├── ImageService.java
│ ├── ChatService.java
│ ├── EmailService.java
│ └── S3Service.java
├── security // 보안 관련 클래스
│ ├── JwtTokenProvider.java
│ ├── JwtAuthenticationFilter.java
│ ├── OAuth2SuccessHandler.java
│ └── CustomUserDetailsService.java
├── exception // 예외 처리
│ ├── GlobalExceptionHandler.java
│ ├── CustomException.java
│ └── ErrorResponse.java
└── UnivMarketApplication.java // 메인 애플리케이션
```

---

### 라이센스

This project is licensed under the MIT License - see the LICENSE file for details.
