package dev.mvc.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/notice")
public class NoticeRestCont {

    @Autowired
    @Qualifier("dev.mvc.notice.NoticeProc")
    private NoticeProcInter noticeProc;

    // ✅ 파일 첨부 등록 (FormData 기반)
    @PostMapping("/create")
    public ResponseEntity<?> create(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("type") String type,
            @RequestParam("user_no") int user_no,
            @RequestParam(value = "question_id", required = false) Integer question_id,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        NoticeVO vo = new NoticeVO();
        vo.setTitle(title);
        vo.setContent(content);
        vo.setType(type);
        vo.setUser_no(user_no);
        vo.setQuestion_id(question_id);

        if (files != null && !files.isEmpty()) {
            MultipartFile file = files.get(0);
            if (!file.isEmpty()) {
                try {
                    String uploadDir = "C:/kd/upload/notice";
                    File folder = new File(uploadDir);
                    if (!folder.exists()) folder.mkdirs();

                    String originName = file.getOriginalFilename();
                    String savedName = UUID.randomUUID().toString() + "_" + originName;
                    File target = new File(uploadDir, savedName);

                    file.transferTo(target);

                    vo.setOrigin_name1(originName);
                    vo.setSaved_name1(savedName);
                    vo.setFiletype1(file.getContentType());
                    vo.setFilesize1(file.getSize());
                } catch (IOException e) {
                    return ResponseEntity.internalServerError().body("파일 저장 실패: " + e.getMessage());
                }
            }
        }

        int cnt = noticeProc.create(vo);
        return ResponseEntity.ok(cnt == 1 ? "success" : "fail");
    }

    // ✅ 리스트 (페이징 포함)
    @GetMapping("/list")
    public HashMap<String, Object> list(@RequestParam(name = "type", defaultValue = "공지") String type,
                                        @RequestParam(name = "now_page", defaultValue = "1") int now_page) {
        int record_per_page = 10;
        int start = (now_page - 1) * record_per_page + 1;
        int end = now_page * record_per_page;

        HashMap<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("start", start);
        map.put("end", end);

        List<NoticeVO> list = noticeProc.list_by_page(map);
        int total = noticeProc.count_by_type(type);

        HashMap<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("now_page", now_page);
        result.put("total", total);
        result.put("record_per_page", record_per_page);
        result.put("type", type);

        return result;
    }

    // ✅ 상세 조회
    @GetMapping("/read/{notice_no}")
    public ResponseEntity<?> read(@PathVariable("notice_no") int notice_no) {
        NoticeVO vo = noticeProc.read(notice_no);
        if (vo == null) {
            return ResponseEntity.notFound().build();
        }
        HashMap<String, Object> result = new HashMap<>();
        result.put("notice", vo);
        return ResponseEntity.ok(result);
    }

    // ✅ 수정 (FormData 기반)
    @PostMapping("/update")
    public ResponseEntity<?> update(
            @RequestParam("notice_no") int notice_no,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("type") String type,
            @RequestParam("user_no") int user_no,
            @RequestParam(value = "question_id", required = false) Integer question_id,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        NoticeVO origin = noticeProc.read(notice_no);
        if (origin == null) return ResponseEntity.notFound().build();

        NoticeVO vo = new NoticeVO();
        vo.setNotice_no(notice_no);
        vo.setTitle(title);
        vo.setContent(content);
        vo.setType(type);
        vo.setUser_no(user_no);
        vo.setQuestion_id(question_id);

        if (files != null && !files.isEmpty()) {
            MultipartFile file = files.get(0);
            if (!file.isEmpty()) {
                try {
                    String uploadDir = "C:/kd/upload/notice";
                    File folder = new File(uploadDir);
                    if (!folder.exists()) folder.mkdirs();

                    String originName = file.getOriginalFilename();
                    String savedName = UUID.randomUUID().toString() + "_" + originName;
                    File target = new File(uploadDir, savedName);

                    file.transferTo(target);

                    vo.setOrigin_name1(originName);
                    vo.setSaved_name1(savedName);
                    vo.setFiletype1(file.getContentType());
                    vo.setFilesize1(file.getSize());
                } catch (IOException e) {
                    return ResponseEntity.internalServerError().body("파일 저장 실패: " + e.getMessage());
                }
            }
        } else {
            vo.setOrigin_name1(origin.getOrigin_name1());
            vo.setSaved_name1(origin.getSaved_name1());
            vo.setFiletype1(origin.getFiletype1());
            vo.setFilesize1(origin.getFilesize1());
        }

        int cnt = noticeProc.update(vo);
        return ResponseEntity.ok(cnt == 1 ? "success" : "fail");
    }

    // ✅ 삭제
    @DeleteMapping("/delete/{notice_no}")
    public ResponseEntity<?> delete(@PathVariable("notice_no") int notice_no) {
        int cnt = noticeProc.delete(notice_no);
        return ResponseEntity.ok(cnt == 1 ? "success" : "fail");
    }
}