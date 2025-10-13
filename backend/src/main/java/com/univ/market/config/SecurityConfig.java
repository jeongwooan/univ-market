package com.univ.market.config;

import com.univ.market.security.JwtAuthenticationFilter;
import com.univ.market.security.JwtTokenProvider;
import com.univ.market.security.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

/**
 * Spring Security 설정 클래스
 * 보안 설정, 인증/인가 규칙, CORS 설정 등을 정의합니다.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    
    /**
     * 보안 필터 체인 설정
     * 인증/인가 규칙, CORS, CSRF, 세션 관리 등을 설정합니다.
     * 
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain
     * @throws Exception 보안 설정 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정 적용
            .cors().configurationSource(corsConfigurationSource())
            .and()
            // CSRF 보호 비활성화 (REST API 서버에서는 일반적으로 비활성화)
            .csrf().disable()
            // 기본 HTTP 인증 비활성화
            .httpBasic().disable()
            // 폼 로그인 비활성화
            .formLogin().disable()
            // 세션 관리 정책 설정 (STATELESS: 세션 사용 안함)
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            // URL 기반 인가 규칙 설정
            .authorizeHttpRequests(auth -> auth
                // 인증 없이 접근 가능한 URL
                .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**", "/api/categories").permitAll()
                .requestMatchers("/api/products").permitAll() // 상품 목록 조회는 인증 없이도 가능
                // 인증이 필요한 URL
                .requestMatchers("/api/products/*/reserve", "/api/products/*/complete").authenticated()
                .requestMatchers("/api/upload/**").authenticated()
                .requestMatchers("/api/users/verify/**").authenticated()
                .requestMatchers("/api/chat/**").authenticated()
                // 그 외 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            // OAuth2 로그인 설정
            .oauth2Login()
                .successHandler(oAuth2SuccessHandler)

                // 2025/10/14 추가, OAuth2 인증 요청 필터의 기본 URI를 프론트엔드 경로로 명시적으로 설정
                .authorizationEndpoint()
                .baseUri("/api/oauth2/authorization") // 이 부분이 핵심입니다.
                .and()
            .and()
            // JWT 인증 필터 추가
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), 
                    UsernamePasswordAuthenticationFilter.class)

            // 2025/10/14 추가, 마이페이지 진입시 CORS 오류 해결 : 인증 실패 시 401 Unauthorized 응답 반환 (리다이렉트 방지)
            .exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            });
        
        return http.build();
    }
    
    /**
     * CORS 설정
     * Cross-Origin Resource Sharing 정책을 정의합니다.
     * 
     * @return CorsConfigurationSource 구현체
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용할 출처
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // 인증 정보 포함 허용
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}