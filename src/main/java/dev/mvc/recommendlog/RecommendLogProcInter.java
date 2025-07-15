package dev.mvc.recommendlog;

import java.util.List;

public interface RecommendLogProcInter {

    /**
     * 추천 로그 등록
     * @param vo
     * @return 등록된 row 수
     */
    public int insert(RecommendLogVO vo);

    /**
     * 전체 추천 로그 목록
     * @return 추천 로그 리스트
     */
    public List<RecommendLogVO> list();

    /**
     * 특정 회원의 추천 로그 목록
     * @param user_no
     * @return 추천 로그 리스트
     */
    public List<RecommendLogVO> list_by_user(int user_no);

    /**
     * 추천 로그 1건 조회
     * @param log_id
     * @return 추천 로그 VO
     */
    public RecommendLogVO read(int log_id);

    /**
     * 추천 로그 삭제
     * @param log_id
     * @return 삭제된 row 수
     */
    public int delete(int log_id);

    /**
     * 전체 추천 로그 개수
     * @return 개수
     */
    public int count();

}
