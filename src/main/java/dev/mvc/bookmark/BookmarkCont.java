package dev.mvc.bookmark;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookmark")
public class BookmarkCont {

  @Autowired
  @Qualifier("dev.mvc.bookmark.BookmarkProc")
  private BookmarkProcInter bookmarkProc;

  /** 즐겨찾기 등록 (trip 또는 post) */
  @PostMapping("/create")
  public int create(@RequestBody HashMap<String, Object> data) {
    int user_no = (int) data.get("user_no");
    String type = (String) data.get("type");

    BookmarkVO vo = new BookmarkVO();
    vo.setUser_no(user_no);

    if ("trip".equals(type)) {
      vo.setTrip_no((Integer) data.get("trip_no"));
      return bookmarkProc.create_trip(vo);
    } else if ("post".equals(type)) {
      vo.setPost_no((Integer) data.get("post_no"));
      return bookmarkProc.create_post(vo);
    } else {
      return 0; // 유효하지 않은 타입
    }
  }

  /** 중복 체크 (trip 또는 post) */
  @PostMapping("/check")
  public int check(@RequestBody HashMap<String, Integer> map) {
    if (map.containsKey("trip_no")) {
      return bookmarkProc.check_duplicate_trip(map);
    } else if (map.containsKey("post_no")) {
      return bookmarkProc.check_duplicate_post(map);
    }
    return 0;
  }

  /** 즐겨찾기 삭제 (trip 또는 post) */
  @PostMapping("/delete")
  public int delete(@RequestBody HashMap<String, Integer> map) {
    BookmarkVO vo = new BookmarkVO();
    vo.setUser_no(map.get("user_no"));

    if (map.containsKey("trip_no")) {
      vo.setTrip_no(map.get("trip_no"));
      return bookmarkProc.delete_by_user_and_trip(vo);
    } else if (map.containsKey("post_no")) {
      vo.setPost_no(map.get("post_no"));
      return bookmarkProc.delete_by_user_and_post(vo);
    }

    return 0;
  }

  /** 즐겨찾기 목록 (단순 VO 목록) */
  @GetMapping("/list")
  public List<BookmarkVO> list(@RequestParam("user_no") int user_no) {
    return bookmarkProc.list_by_user(user_no);
  }

  /** 즐겨찾기 목록 (JOIN된 trip + post 정보 포함) */
  @GetMapping("/list_join")
  public List<BookmarkJoinVO> list_join(@RequestParam("user_no") int user_no) {
    return bookmarkProc.list_join_by_user(user_no);
  }

  // 게시글용 즐겨찾기 등록
  @PostMapping("/create_post")
  public int createPost(@RequestBody BookmarkVO vo) {
    return bookmarkProc.create_post(vo);
  }

  // 게시글용 즐겨찾기 삭제
  @PostMapping("/delete_post")
  public int deletePost(@RequestBody BookmarkVO vo) {
    return bookmarkProc.delete_by_user_and_post(vo);
  }

  // 게시글 북마크 중복 확인
  @PostMapping("/check_post")
  public int checkPost(@RequestBody HashMap<String, Integer> map) {
    return bookmarkProc.check_duplicate_post(map);
  }
}
