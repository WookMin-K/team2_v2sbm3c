package dev.mvc.users;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {
  // application.properties 에 이미 file:// 설정이 되어 있으므로
  // 업로드 경로는 C:/kd/upload
  @Value("${spring.web.resources.static-locations}")
  private String staticLocations; // ex: "file:///C:/kd/upload/"

  public String saveProfileImage(String userId, MultipartFile file) throws IOException {
    // 원본 확장자
    String original = file.getOriginalFilename();
    String ext = original.substring(original.lastIndexOf('.'));
    // 랜덤한 파일명
    String filename = UUID.randomUUID().toString() + ext;

    // 실제 파일을 저장할 디렉토리: C:/kd/upload/profiles/{userId}/
    // staticLocations 은 "file:///C:/kd/upload/" 형태이므로 앞 7글자("file:///") 제거
    String uploadRoot = staticLocations.replace("file:///", "");
    File userDir = Paths.get(uploadRoot, "profiles", userId).toFile();
    if (!userDir.exists()) userDir.mkdirs();

    File dest = new File(userDir, filename);
    file.transferTo(dest);

    // 클라이언트에서 접근할 URL 경로: /images/profiles/{userId}/{filename}
    return "/images/profiles/" + userId + "/" + filename;
  }
}