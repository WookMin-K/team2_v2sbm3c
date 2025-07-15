package dev.mvc.main_travel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;


@Service
public class TravelMainProc implements TravelMainProcInter {

    @Autowired
//    @Qualifier("dev.mvc.main_travel.TravelMainDAOInter")
    private TravelMainDAOInter travelMainDAO;

    @Override
    public int create(TravelMainVO vo) {
        return travelMainDAO.create(vo);
    }

    @Override
    public List<TravelMainVO> listByUserNo(int user_no) {
        return travelMainDAO.listByUserNo(user_no);
    }

    @Override
    public int deleteByUserNo(int user_no) {
        return travelMainDAO.deleteByUserNo(user_no);
    }
}
