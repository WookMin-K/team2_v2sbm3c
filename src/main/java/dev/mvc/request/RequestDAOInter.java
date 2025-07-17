package dev.mvc.request;

import java.util.List;

public interface RequestDAOInter {
    int create(RequestVO requestVO);

    List<RequestVO> listByUser(int user_no);

    List<RequestVO> listAll();

    RequestVO read(int request_no);

    int update(RequestVO requestVO);

    int delete(int request_no);
    int updateAnswer(RequestVO requestVO);
}
