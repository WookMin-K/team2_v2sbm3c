// src/main/java/dev/mvc/users/CustomOAuth2UserService.java
package dev.mvc.users;

import dev.mvc.users_sns.UsersSnsProc;
import dev.mvc.users_sns.UsersSnsVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private HttpSession session;

    @Autowired
    @Qualifier("dev.mvc.users.UsersProc")
    private UsersProcInter usersProc;

    @Autowired
    private UsersSnsProc usersSnsProc;

    @SuppressWarnings("unchecked")
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // 1) OAuth2User 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2) provider, attributes 추출
        String provider = userRequest.getClientRegistration().getRegistrationId();
        Map<String,Object> attributes = oAuth2User.getAttributes();

        String snsId = null, name = null, email = null, phone = null;
        if ("naver".equals(provider)) {
            Map<String,Object> resp = (Map<String,Object>) attributes.get("response");
            snsId  = (String) resp.get("id");
            name   = (String) resp.get("name");
            email  = (String) resp.get("email");
            phone  = (String) resp.get("mobile");
        }
        else if ("kakao".equals(provider)) {
            snsId = String.valueOf(attributes.get("id"));
            Map<String,Object> kakaoAcc = (Map<String,Object>) attributes.get("kakao_account");
            Map<String,Object> profile  = (Map<String,Object>) kakaoAcc.get("profile");
            name  = (String) profile.get("nickname");
            email = (String) kakaoAcc.get("email");
            phone = "";
        }
        else if ("google".equals(provider)) {
            snsId  = (String) attributes.get("sub");
            name   = (String) attributes.get("name");
            email  = (String) attributes.get("email");
            phone  = "";
        }

        String newUserId = provider + "_" + snsId;

        // 3) DB에서 사용자 읽기 (없으면 생성)
        UsersVO user = usersProc.readById(newUserId);
        if (user == null) {
            // 신규 가입
            UsersVO vo = new UsersVO();
            vo.setUser_id(newUserId);
            vo.setName(name);
            vo.setEmail(email);
            vo.setPhone(phone);
            vo.setGrade(1);
            vo.setPassword(UUID.randomUUID().toString());
            usersProc.create(vo);
            user = usersProc.readById(newUserId);
        }

        // 4) SNS 연동 테이블에도 없다면 등록
        if (usersProc.checkSnsId(snsId) == 0) {  // 아직 연동 정보가 없으면
            UsersSnsVO snsVO = new UsersSnsVO();
            snsVO.setProvider(provider);
            snsVO.setProvider_no(snsId);
            snsVO.setUser_no(user.getUser_no());
            usersSnsProc.create(snsVO);
        }

        // 5) **무조건** 세션에 로그인 정보 저장
        session.setAttribute("user_no",  user.getUser_no());
        session.setAttribute("user_id",  user.getUser_id());
        session.setAttribute("name",     user.getName());
        session.setAttribute("grade",    user.getGrade());

        return oAuth2User;
    }
}
