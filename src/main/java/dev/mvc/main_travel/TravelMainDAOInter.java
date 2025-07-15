package dev.mvc.main_travel;

import java.util.List;

public interface TravelMainDAOInter {

    public int create(TravelMainVO vo);

    public List<TravelMainVO> listByUserNo(int user_no);

    public int deleteByUserNo(int user_no);
}
