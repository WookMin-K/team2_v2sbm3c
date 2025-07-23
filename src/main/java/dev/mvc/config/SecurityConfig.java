// src/main/java/dev/mvc/config/SecurityConfig.java
package dev.mvc.config;

import dev.mvc.users.CustomOAuth2UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ApplicationContext context;

    public SecurityConfig(ApplicationContext context) {
        this.context = context;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
          .csrf(csrf -> csrf.disable())
          .cors(cors -> cors.configurationSource(corsConfigurationSource()))
          .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()
          )
          .oauth2Login(oauth2 -> oauth2
            // 로그인 성공 후 리다이렉트될 URL
            .defaultSuccessUrl("http://192.168.12.142:3000", true)
            .userInfoEndpoint(userInfo -> userInfo
              // 커스텀 서비스 주입
              .userService(context.getBean(CustomOAuth2UserService.class))
            )
            .successHandler((request, response, authentication) -> {
              // 팝업 닫기 스크립트만 실행
              response.setContentType("text/html;charset=UTF-8");
              response.getWriter().write("""
                <script>
                  window.opener.postMessage('OAUTH2_LOGIN_SUCCESS', '*');
                  window.close();
                </script>
              """);
            })
          )
          .logout(logout -> logout
            .logoutSuccessUrl("/")
            .permitAll()
          );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
          "http://localhost:3000",
          "http://192.168.12.142:3000"
        ));
        config.setAllowedMethods(Arrays.asList(
          "GET","POST","PUT","DELETE","OPTIONS"
        ));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
