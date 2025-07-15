package dev.mvc.bookmark;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.bookmark.BookmarkProc")
public class BookmarkProc implements BookmarkProcInter {

  @Autowired
  private BookmarkDAOInter bookmarkDAO;

  @Override
  public int create_trip(BookmarkVO bookmarkVO) {
    return bookmarkDAO.create_trip(bookmarkVO);
  }

  @Override
  public int create_post(BookmarkVO bookmarkVO) {
    return bookmarkDAO.create_post(bookmarkVO);
  }

  @Override
  public List<BookmarkVO> list_by_user(int user_no) {
    return bookmarkDAO.list_by_user(user_no);
  }

  @Override
  public int check_duplicate_trip(HashMap<String, Integer> map) {
    return bookmarkDAO.check_duplicate_trip(map);
  }

  @Override
  public int check_duplicate_post(HashMap<String, Integer> map) {
    return bookmarkDAO.check_duplicate_post(map);
  }

  @Override
  public int delete_by_user_and_trip(BookmarkVO bookmarkVO) {
    return bookmarkDAO.delete_by_user_and_trip(bookmarkVO);
  }

  @Override
  public int delete_by_user_and_post(BookmarkVO bookmarkVO) {
    return bookmarkDAO.delete_by_user_and_post(bookmarkVO);
  }

  @Override
  public List<BookmarkJoinVO> list_join_by_user(int user_no) {
    return bookmarkDAO.list_join_by_user(user_no);
  }
}
