package dev.mvc.post;

import dev.mvc.reply.ReplyProcInter;
import dev.mvc.reply.ReplyVO;
import dev.mvc.users.UsersProcInter;
import dev.mvc.users.UsersVO;
import dev.mvc.util.FileUploadUtil;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/post")
public class PostRestCont {

    private final FileUploadUtil fileUtil;
    private final UsersProcInter usersProc;
    private final PostProcInter postProc;
    private final ReplyProcInter replyProc;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public PostRestCont(
            FileUploadUtil fileUtil,
            @Qualifier("dev.mvc.users.UsersProc")UsersProcInter usersProc,
            @Qualifier("dev.mvc.post.PostProc") PostProcInter postProc,
            @Qualifier("dev.mvc.reply.ReplyProc") ReplyProcInter replyProc
    ) {
        this.fileUtil = fileUtil;
        this.usersProc = usersProc;
        this.postProc = postProc;
        this.replyProc = replyProc;
    }

    // ✅ 게시글 등록
    @PostMapping("/create")
    public HashMap<String, Object> create(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("user_no") int user_no,
            @RequestParam(value = "notice_yn", defaultValue = "N") String notice_yn,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "files", required = false) MultipartFile normalFile
    ) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println(">>> notice_yn param = " + notice_yn);
        PostVO vo = new PostVO();
        vo.setTitle(title);
        vo.setContent(content);
        vo.setUser_no(user_no);
        vo.setNotice_yn(notice_yn);
        System.out.println(">>> vo.getNotice_yn() = " + vo.getNotice_yn());

        try {
            // 이미지 저장
            if (imageFile != null && !imageFile.isEmpty()) {
                Path savedPath = fileUtil.storeFile(imageFile);
                String savedName = savedPath.getFileName().toString();
                vo.setImage(savedName);
                vo.setImage_org(imageFile.getOriginalFilename());
                vo.setImage_type(imageFile.getContentType());
                vo.setImage_size(imageFile.getSize());
            }
            // 일반 파일 저장
            if (normalFile != null && !normalFile.isEmpty()) {
                Path savedPath = fileUtil.storeFile(normalFile);
                String savedName = savedPath.getFileName().toString();
                vo.setFiles(savedName);
                vo.setFile_org(normalFile.getOriginalFilename());
                vo.setFile_type(normalFile.getContentType());
                vo.setFile_size(normalFile.getSize());
            } else {
                vo.setFiles(null);
                vo.setFile_org(null);
                vo.setFile_type(null);
                vo.setFile_size(0L);
            }
        } catch (IOException e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("message", e.getMessage());
            return result;
        }

        int cnt = postProc.create(vo);
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    // ✅ 게시글 목록 (페이징 포함)
    @GetMapping("/list")
    public HashMap<String, Object> list(
            @RequestParam(name = "page", defaultValue = "1") int now_page,
            @RequestParam(name = "type", defaultValue = "all") String type,
            @RequestParam(name = "keyword", defaultValue = "") String keyword) {

        int record_per_page = 10;
        int start = (now_page - 1) * record_per_page + 1;
        int end = now_page * record_per_page;

        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("start", start);
        paramMap.put("end", end);
        paramMap.put("type", type);
        paramMap.put("keyword", "%" + keyword + "%");

        List<PostVO> list = postProc.search_by_page(paramMap);
        int total = postProc.search_count(paramMap);

        HashMap<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("now_page", now_page);
        result.put("total", total);
        result.put("record_per_page", record_per_page);

        return result;
    }

    // ✅ 게시글 상세보기 + 댓글 포함
    @GetMapping("/read/{post_no}")
    public HashMap<String, Object> read(@PathVariable("post_no") int post_no) {
        postProc.increaseViewCnt(post_no);
        PostVO postVO = postProc.read(post_no);
        List<ReplyVO> replyList = replyProc.list_by_post(post_no);

        // 이전글, 다음글 조회
        PostVO prevPost = postProc.readPrev(post_no);
        PostVO nextPost = postProc.readNext(post_no);


        HashMap<String, Object> result = new HashMap<>();
        result.put("post", postVO);
        result.put("replies", replyList);
        result.put("prev", prevPost);
        result.put("next", nextPost);
        return result;
    }

    // ✅ 게시글 수정
    @PostMapping("/update")
    public HashMap<String, Object> update(
            @RequestParam("post_no") int post_no,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("user_no") int user_no,
            @RequestParam("notice_yn") String notice_yn,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "files", required = false) MultipartFile normalFile
    ) {
        HashMap<String, Object> result = new HashMap<>();
        PostVO post = postProc.read(post_no);

        try {
            // 이미지 교체
            if (imageFile != null && !imageFile.isEmpty()) {
                if (post.getImage() != null) {
                    Path oldPath = Paths.get(uploadDir).resolve(post.getImage());
                    Files.deleteIfExists(oldPath);
                }
                Path savedPath = fileUtil.storeFile(imageFile);
                String savedName = savedPath.getFileName().toString();
                post.setImage(savedName);
                post.setImage_org(imageFile.getOriginalFilename());
                post.setImage_type(imageFile.getContentType());
                post.setImage_size(imageFile.getSize());
            }
            // 일반 파일 교체
            if (normalFile != null && !normalFile.isEmpty()) {
                if (post.getFiles() != null) {
                    Path oldPath = Paths.get(uploadDir).resolve(post.getFiles());
                    Files.deleteIfExists(oldPath);
                }
                Path savedPath = fileUtil.storeFile(normalFile);
                String savedName = savedPath.getFileName().toString();
                post.setFiles(savedName);
                post.setFile_org(normalFile.getOriginalFilename());
                post.setFile_type(normalFile.getContentType());
                post.setFile_size(normalFile.getSize());
            }
            // 기타 필드
            post.setTitle(title);
            post.setContent(content);
            post.setUser_no(user_no);
            post.setNotice_yn(notice_yn);
        } catch (IOException e) {
            e.printStackTrace();
            result.put("result", "fail");
            result.put("message", e.getMessage());
            return result;
        }

        postProc.update(post);
        result.put("result", "success");
        return result;
    }

    // ✅ 게시글 삭제
//    @DeleteMapping("/delete/{post_no}")
//    public HashMap<String, Object> delete(@PathVariable("post_no") int post_no) {
//        HashMap<String, Object> result = new HashMap<>();
//        int cnt = postProc.delete(post_no);
//        result.put("result", cnt == 1 ? "success" : "fail");
//        return result;
//    }
    @DeleteMapping("/delete/{post_no}")
    public HashMap<String, Object> delete(@PathVariable("post_no") int post_no, HttpSession session) {
        HashMap<String, Object> result = new HashMap<>();

        // 로그인 확인
        Integer loginUserNo = (Integer) session.getAttribute("user_no");
        if (loginUserNo == null) {
            result.put("result", "loginRequired");
            return result;
        }
        // 게시글 존재 여부 확인
        PostVO post = postProc.read(post_no);
        if (post == null) {
            result.put("result", "notFound");
            return result;
        }
        // 작성자 여부, 관리자 여부 체크
        boolean isWriter = loginUserNo.equals(post.getUser_no());
        boolean isAdmin  = usersProc.isAdmin(session);
        if (!isWriter && !isAdmin) {
            result.put("result", "forbidden");
            return result;
        }
        // 실제 삭제
        int cnt = postProc.delete(post_no);
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }



    // ✅ 이미지 서빙
    @GetMapping("/post/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable("filename") String filename) throws IOException {
        Path imagePath = Paths.get(uploadDir).resolve(filename).normalize();
        UrlResource resource = new UrlResource(imagePath.toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        String contentType = Files.probeContentType(imagePath);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // ✅ 이미지 삭제
    @DeleteMapping("/delete/image/{post_no}")
    public HashMap<String, Object> deleteImage(@PathVariable("post_no") int post_no) {
        HashMap<String, Object> result = new HashMap<>();
        PostVO post = postProc.read(post_no);
        if (post.getImage() != null) {
            try {
                Path oldPath = Paths.get(uploadDir).resolve(post.getImage());
                Files.deleteIfExists(oldPath);
            } catch (IOException e) {
                e.printStackTrace();
            }
            PostVO vo = new PostVO();
            vo.setPost_no(post_no);
            vo.setImage(null);
            vo.setImage_org(null);
            vo.setImage_type(null);
            vo.setImage_size(0L);
            postProc.update_image(vo);
        }
        result.put("result", "success");
        return result;
    }

    // ✅ 파일 삭제
    @DeleteMapping("/delete/file/{post_no}")
    public HashMap<String, Object> deleteFile(@PathVariable("post_no") int post_no) {
        HashMap<String, Object> result = new HashMap<>();
        PostVO post = postProc.read(post_no);
        if (post.getFiles() != null) {
            try {
                Path oldPath = Paths.get(uploadDir).resolve(post.getFiles());
                Files.deleteIfExists(oldPath);
            } catch (IOException e) {
                e.printStackTrace();
            }
            PostVO vo = new PostVO();
            vo.setPost_no(post_no);
            vo.setFiles(null);
            vo.setFile_org(null);
            vo.setFile_type(null);
            vo.setFile_size(0L);
            postProc.update_file(vo);
        }
        result.put("result", "success");
        return result;
    }

    // ✅ 파일 다운로드
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileName") String fileName) throws Exception {
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        String originalFileName = postProc.getOriginalFileName(fileName);
        String encodedFileName = URLEncoder.encode(originalFileName, "UTF-8").replaceAll("\\+", "%20");
        UrlResource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"");
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}
