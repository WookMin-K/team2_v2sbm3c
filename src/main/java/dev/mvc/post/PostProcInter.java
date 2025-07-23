package dev.mvc.post;



import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public interface PostProcInter {

  /**
   * 게시글 등록
   * @param postVO
   * @return 등록된 레코드 수
   */
  public int create(PostVO postVO);

  /**
   * 게시글 목록 조회
   * @return 게시글 리스트
   */
  public List<PostVO> list();

  /**
   * 게시글 전체 수
   * @return 전체 게시글 수
   */
  public int list_count();

  /**
   * 목록 페이징
   * @return 페이지 범위 내 게시글 리스트
   */
  public List<PostVO> list_by_page(HashMap<String, Object> map);

  /**
   * 게시글 상세 조회
   * @param post_no
   * @return PostVO
   */
  public PostVO read(int post_no);

  /**
   * 게시글 수정
   * @param postVO
   * @return 수정된 레코드 수
   */
  public int update(PostVO postVO);

  /**
   * 이미지 수정
   * @param postVO
   * @return
   */
  public int update_image(PostVO postVO);

  /**
   * 파일 수정
   * @param postVO
   * @return
   */
  public int update_file(PostVO postVO);
  /**
   * 게시글 삭제
   * @param post_no
   * @return 삭제된 레코드 수
   */
  public int delete(int post_no);

  /**
   * 조회수
   * @param post_no
   * @return
   */
  public int increaseViewCnt(int post_no);
  
  public String getOriginalFileName(String fileName);



  /**
   * 검색 + 페이징
   * @param paramMap
   * @return
   */
  public List<PostVO> search_by_page(Map<String, Object> paramMap);

  /**
   * 검색된 게시글 수
   * @param paramMap
   * @return
   */
  public int search_count(Map<String, Object> paramMap);

  /**
   * 이전 글 조회
   * @param post_no
   * @return
   */
  public PostVO readPrev(int post_no);

  /**
   * 다음 글 조회
   * @param post_no
   * @return
   */
  public PostVO readNext(int post_no);
  
  /**
   * 내가 쓴 글 목록 (페이징)
   * @param page
   * @param userNo
   * @return
   */
  Map<String,Object> listByUser(int page, int userNo);

  /**
   * 검색 (페이징)
   * @param param
   * @return
   */
  List<PostVO> searchMyByPage(Map<String,Object> param);
  
  /**
   * 검색 건수
   */
  int searchMyCount(Map<String,Object> param);

  int updateHiddenYn(@Param("postNo") int postNo,
                     @Param("hiddenYn") String hiddenYn);

}
