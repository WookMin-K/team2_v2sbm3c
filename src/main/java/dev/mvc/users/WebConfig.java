
//package dev.mvc.users;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//
//        System.out.println("✅ WebConfig loaded!!");  // 서버 시작 시 로그 찍힘
//
//        // React 라우터의 모든 경로를 index.html로 매핑
//        registry.addViewController("/{spring:[a-zA-Z0-9-]+}")
//                .setViewName("forward:/index.html");
//
//        registry.addViewController("/**/{spring:[a-zA-Z0-9-]+}")
//                .setViewName("forward:/index.html");
//
//        registry.addViewController("/{spring:[a-zA-Z0-9-]+}/**{spring:?!(\\.js|\\.css)$}")
//                .setViewName("forward:/index.html");
//    }
//
////    @Override
////    public void addCorsMappings(CorsRegistry registry) {
////      registry.addMapping("/**")
////        .allowedOrigins("http://localhost:3000") // 프론트 주소
////        .allowedMethods("GET", "POST", "PUT", "DELETE")
////        .allowCredentials(true); //
////    }
//}
package dev.mvc.users;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//
//        System.out.println("✅ WebConfig loaded!!");  // 서버 시작 시 로그 찍힘
//
//        // React 라우터의 모든 경로를 index.html로 매핑
//        registry.addViewController("/{spring:[a-zA-Z0-9-]+}")
//                .setViewName("forward:/index.html");
//
//        registry.addViewController("/**/{spring:[a-zA-Z0-9-]+}")
//                .setViewName("forward:/index.html");
//
//        registry.addViewController("/{spring:[a-zA-Z0-9-]+}/**{spring:?!(\\.js|\\.css)$}")
//                .setViewName("forward:/index.html");
//    }
  
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
                .allowedOrigins("*") // 프론트 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(false); //
            //  .allowCredentials(true);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/kd/upload/");
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:///C:/kd/upload/");
    }
}
