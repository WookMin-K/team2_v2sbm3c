package dev.mvc.bookmark;

import java.util.HashMap;
import java.util.List;

public interface BookmarkDAOInter {

  // 여행지 즐겨찾기 등록
  public int create_trip(BookmarkVO bookmarkVO);

  // 게시글 즐겨찾기 등록
  public int create_post(BookmarkVO bookmarkVO);

  // 단순 리스트
  public List<BookmarkVO> list_by_user(int user_no);

  // 중복 확인
  public int check_duplicate_trip(HashMap<String, Integer> map);
  public int check_duplicate_post(HashMap<String, Integer> map);

  // 삭제
  public int delete_by_user_and_trip(BookmarkVO bookmarkVO);
  public int delete_by_user_and_post(BookmarkVO bookmarkVO);

  // JOIN 목록
  public List<BookmarkJoinVO> list_join_by_user(int user_no);
}
