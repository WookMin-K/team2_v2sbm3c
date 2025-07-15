package dev.mvc.util;  // util 패키지

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUploadUtil {

  @Value("${file.upload-dir}")
  private String uploadDir;
  private Path uploadPath;

  /**
   * Bean 초기화 시 uploadDir 경로 설정 및 디렉터리 생성
   */
  @PostConstruct
  public void init() throws IOException {
    // uploadDir이 null이 아니도록 경로 설정
    uploadPath = Paths.get(uploadDir)
                      .toAbsolutePath()
                      .normalize();
    // 디렉터리가 없으면 생성
    Files.createDirectories(uploadPath);
  }

  /**
   * MultipartFile을 원본 파일명으로 저장하되,
   * 중복이 발생하면 (1), (2)... 형태로 suffix를 붙여 저장합니다.
   */
  public Path storeFile(MultipartFile file) throws IOException {
    // 디렉터리 보장 (init 이후에도 안전하게)
    Files.createDirectories(uploadPath);

    // 원본 파일명 정리 및 보안 체크
    String original = StringUtils.cleanPath(file.getOriginalFilename());
    if (original.contains("..")) {
      throw new IOException("유효하지 않은 파일명입니다: " + original);
    }

    // 저장할 경로 계산
    Path target = uploadPath.resolve(original);
    // 중복 파일이 있으면 (1), (2) 식으로 suffix 붙이기
    if (Files.exists(target)) {
      String name = original;
      String ext = "";
      int idx = original.lastIndexOf('.');
      if (idx != -1) {
        name = original.substring(0, idx);
        ext = original.substring(idx);
      }
      int count = 1;
      do {
        String newName = String.format("%s(%d)%s", name, count++, ext);
        target = uploadPath.resolve(newName);
      } while (Files.exists(target));
    }

    // 파일 저장
    file.transferTo(target.toFile());
    return target;
  }
}
