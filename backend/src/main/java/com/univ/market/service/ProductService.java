package com.univ.market.service;

import com.univ.market.domain.Category;
import com.univ.market.domain.Image;
import com.univ.market.domain.Product;
import com.univ.market.domain.User;
import com.univ.market.dto.request.ProductRequest;
import com.univ.market.dto.response.ProductResponse;
import com.univ.market.repository.CategoryRepository;
import com.univ.market.repository.ProductRepository;
import com.univ.market.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 상품 관련 비즈니스 로직을 처리하는 서비스 클래스
 * 상품 등록, 조회, 예약, 거래 완료, 삭제 등의 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    /**
     * 상품을 등록하는 메서드
     * 
     * @param request 상품 등록 요청 데이터
     * @param userId 판매자 ID
     * @return 등록된 상품 정보
     * @throws IllegalArgumentException 존재하지 않는 사용자나 카테고리인 경우
     */
    @Transactional
    public ProductResponse createProduct(ProductRequest request, Long userId) {
        // 판매자 정보 조회
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        // 카테고리 정보 조회
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        
        // 상품 엔티티 생성
        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .status(Product.ProductStatus.WAITING) // 초기 상태는 '판매중'
                .category(category)
                .seller(seller)
                .build();
        
        // 이미지 추가
        if (request.getImageUrls() != null) {
            List<Image> images = request.getImageUrls().stream()
                    .map(url -> Image.builder()
                            .imageUrl(url)
                            .product(product)
                            .build())
                    .collect(Collectors.toList());
            product.setImages(images);
        }
        
        // 상품 저장
        Product savedProduct = productRepository.save(product);
        
        // 대학 내 사용자들에게 새 상품 알림 메일 전송
        // emailService.sendNewProductNotification(savedProduct);
        
        return ProductResponse.fromEntity(savedProduct);
    }
    
    /**
     * 모든 상품을 페이징하여 조회하는 메서드
     * 
     * @param pageable 페이징 정보
     * @return 상품 목록 페이지
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ProductResponse::fromEntity);
    }
    
    /**
     * 키워드로 상품을 검색하는 메서드
     * 
     * @param keyword 검색 키워드
     * @param pageable 페이징 정보
     * @return 검색 결과 페이지
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, pageable)
                .map(ProductResponse::fromEntity);
    }

  /**
     * 카테고리별로 상품을 조회하는 메서드
     * 
     * @param categoryId 카테고리 ID
     * @param pageable 페이징 정보
     * @return 해당 카테고리의 상품 목록 페이지
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable)
                .map(ProductResponse::fromEntity);
    }
    
    /**
     * ID로 상품 상세 정보를 조회하는 메서드
     * 
     * @param id 상품 ID
     * @return 상품 상세 정보
     * @throws IllegalArgumentException 존재하지 않는 상품인 경우
     */
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        return ProductResponse.fromEntity(product);
    }
    
    /**
     * 상품을 예약 상태로 변경하는 메서드
     * 
     * @param productId 상품 ID
     * @param buyerId 구매자 ID
     * @return 업데이트된 상품 정보
     * @throws IllegalArgumentException 존재하지 않는 상품이나 사용자인 경우
     * @throws IllegalStateException 이미 판매 완료된 상품인 경우
     */
    @Transactional
    public ProductResponse reserveProduct(Long productId, Long buyerId) {
        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        
        // 구매자 정보 조회
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("구매자를 찾을 수 없습니다."));
        
        // 이미 판매완료된 상품인지 확인
        if (product.getStatus() == Product.ProductStatus.COMPLETED) {
            throw new IllegalStateException("이미 판매 완료된 상품입니다.");
        }
        
        // 예약 상태로 변경
        product.setStatus(Product.ProductStatus.RESERVED);
        product.setBuyer(buyer);
        
        Product updatedProduct = productRepository.save(product);
        
        // 판매자에게 예약 알림 메일 전송
        // emailService.sendReservationNotification(updatedProduct);
        
        return ProductResponse.fromEntity(updatedProduct);
    }
    
    /**
     * 상품을 거래 완료 상태로 변경하는 메서드
     * 
     * @param productId 상품 ID
     * @return 업데이트된 상품 정보
     * @throws IllegalArgumentException 존재하지 않는 상품인 경우
     * @throws IllegalStateException 예약 상태가 아닌 상품인 경우
     */
    @Transactional
    public ProductResponse completeTransaction(Long productId) {
        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        
        // 예약 상태가 아닌 경우 에러
        if (product.getStatus() != Product.ProductStatus.RESERVED) {
            throw new IllegalStateException("예약 상태의 상품만 거래 완료할 수 있습니다.");
        }
        
        // 거래 완료 상태로 변경
        product.setStatus(Product.ProductStatus.COMPLETED);
        
        Product updatedProduct = productRepository.save(product);
        
        // 구매자와 판매자에게 거래 완료 알림 메일 전송
        emailService.sendTransactionCompletedNotification(updatedProduct);
        
        return ProductResponse.fromEntity(updatedProduct);
    }
    
    /**
     * 상품을 삭제하는 메서드
     * 판매자 본인만 삭제 가능합니다.
     * 
     * @param productId 상품 ID
     * @param userId 요청자 ID
     * @throws IllegalArgumentException 존재하지 않는 상품인 경우
     * @throws IllegalStateException 판매자가 아닌 사용자가 삭제 시도하는 경우
     */
    @Transactional
    public void deleteProduct(Long productId, Long userId) {
        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        
        // 판매자 확인
        if (!product.getSeller().getId().equals(userId)) {
            throw new IllegalStateException("본인이 등록한 상품만 삭제할 수 있습니다.");
        }
        
        // 상품 삭제
        productRepository.delete(product);
    }
    /**
     * 2025/10/14 추가
     * 특정 판매자의 상품 목록을 조회하는 메서드 (마이페이지에서 사용)
     *
     * @param sellerId 판매자 ID
     * @return 상품 목록
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsBySeller(Long sellerId) {
        // Repository에서 판매자 ID로 상품 목록을 가져옵니다.
        List<Product> products = productRepository.findBySellerId(sellerId);
        
        // DTO로 변환하여 반환합니다.
        return products.stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }    
}