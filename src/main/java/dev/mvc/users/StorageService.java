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
  @Value("${spring.web.resources.static-locations}")
  private String staticLocations; // file:///C:/kd/upload/

  /**
   * 프로필 이미지를 userId 기반 고정 이름으로 저장.
   *
   * @return 덮어쓴 후의 URL (프론트는 이 URL 고정 사용)
   */
  public String saveProfileImage(String userId, MultipartFile file) throws IOException {
    // 1) 확장자 추출
    String original = file.getOriginalFilename();
    String ext      = original.substring(original.lastIndexOf('.'));  // ".png"

    // 2) 실제 파일 저장 루트 경로 추출  ← 수정됨
    //    staticLocations: "file:///C:/kd/upload/"
    String uploadRoot = staticLocations.replace("file:///", "");      // "C:/kd/upload/"

    // 3) profiles 폴더만 사용 (userId 하위 폴더 없이 덮어쓰기)  ← 수정됨
    File profilesDir = Paths.get(uploadRoot, "profiles").toFile();
    if (!profilesDir.exists()) profilesDir.mkdirs();

    // 4) 고정된 파일명(userId + ext)으로 저장  ← 수정됨
    File dest = new File(profilesDir, userId + ext);
    file.transferTo(dest);

    // 5) 클라이언트에서 사용하는 URL
    return "/images/profiles/" + userId + ext;
  }
}
