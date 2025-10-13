package com.univ.market.repository;

import com.univ.market.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List; // 2025/10/14 추가

/**
 * 상품 엔티티에 대한 데이터 액세스 인터페이스
 * JpaRepository를 확장하여 기본적인 CRUD 기능을 제공합니다.
 * JpaSpecificationExecutor를 확장하여 동적 쿼리 기능을 제공합니다.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    /**
     * 모든 상품을 생성일 기준 내림차순으로 페이징하여 조회하는 메서드
     * 
     * @param pageable 페이징 정보
     * @return 상품 목록 페이지
     */
    Page<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * 키워드로 상품을 검색하는 메서드
     * 제목 또는 설명에 키워드가 포함된 상품을 검색합니다.
     * 
     * @param keyword 검색 키워드
     * @param pageable 페이징 정보
     * @return 검색 결과 페이지
     */
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * 카테고리별로 상품을 조회하는 메서드
     * 
     * @param categoryId 카테고리 ID
     * @param pageable 페이징 정보
     * @return 해당 카테고리의 상품 목록 페이지
     */
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    /**
     * 대학교별로 상품을 조회하는 메서드
     * 같은 대학교 학생들의 상품만 조회할 때 사용합니다.
     * 
     * @param universityName 대학교 이름
     * @param pageable 페이징 정보
     * @return 해당 대학교 학생들의 상품 목록 페이지
     */
    Page<Product> findBySellerUniversityName(String universityName, Pageable pageable);

    /**
     * 2025/10/14 추가
     * 특정 판매자 ID로 상품을 조회하는 메서드
     * * @param sellerId 판매자 ID
     * @return 해당 판매자의 상품 목록
     */
    List<Product> findBySellerId(Long sellerId);
}
