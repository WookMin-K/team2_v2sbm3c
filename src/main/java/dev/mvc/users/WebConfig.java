package dev.mvc.users;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
      // 확장자 없는 경로만 index.html 로
      registry.addViewController("/{path:[^\\.]+}")
              .setViewName("forward:/index.html");
      registry.addViewController("/**/{path:[^\\.]+}")
              .setViewName("forward:/index.html");
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
              .allowedOrigins("http://localhost:3000", "http://192.168.12.142:3000")
              .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .allowCredentials(true);
  }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/kd/upload/");
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:///C:/kd/upload/");
    }
}
