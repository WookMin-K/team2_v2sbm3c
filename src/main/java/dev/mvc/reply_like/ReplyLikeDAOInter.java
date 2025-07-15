package dev.mvc.reply_like;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;
@Mapper
public interface ReplyLikeDAOInter {
    /**
     * 좋아요 추가
     * @param map
     * @return
     */
    public int insertLike(Map<String, Object> map);

    /**
     * 좋아요 취소
     * @param map
     * @return
     */
    public int deleteLike(Map<String, Object> map);

    /**
     * 전체 좋아요 수
     * @param reply_no
     * @return
     */
    public int countLikes(int reply_no);

    /**
     * 특정 유저가 눌렀는지
     * @param map
     * @return
     */
    public int isLiked(Map<String, Object> map);

}
