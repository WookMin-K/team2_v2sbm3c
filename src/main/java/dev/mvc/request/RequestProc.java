package dev.mvc.request;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RequestProc implements RequestProcInter {

    @Autowired
    private RequestDAOInter requestDAO;

    @Override
    public int create(RequestVO requestVO) {
        return requestDAO.create(requestVO);
    }

    @Override
    public List<RequestVO> listByUser(int user_no) {
        return requestDAO.listByUser(user_no);
    }

    @Override
    public List<RequestVO> listAll() {
        return requestDAO.listAll();
    }

    @Override
    public RequestVO read(int request_no) {
        return requestDAO.read(request_no);
    }

    @Override
    public int update(RequestVO requestVO) {
        return requestDAO.update(requestVO);
    }

    @Override
    public int delete(int request_no) {
        return requestDAO.delete(request_no);
    }
    @Override
    public int updateAnswer(RequestVO requestVO) {
        return requestDAO.updateAnswer(requestVO);
    }
    
    @Override
    public List<RequestVO> listUnanswered() {
        return requestDAO.listUnanswered();
    }
}
