package dev.mvc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

@Override
public void addCorsMappings(CorsRegistry registry) {
  registry.addMapping("/**")
          .allowedOrigins("http://localhost:3000")   // ✅ 패턴 대신 정확한 주소!
          .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
          .allowedHeaders("*")
          .allowCredentials(true);  // ✅ 꼭 필요!
}

@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/notice/**")
            .addResourceLocations("file:///C:/kd/upload/notice/");
}
}