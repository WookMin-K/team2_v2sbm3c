package dev.mvc.users_sns;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UsersSnsVO {
    private int sns_no;
    private String provider;
    private String provider_no;
    private int user_no;
    private String created_at;

    @Override
    public String toString() {
        return "UsersSnsVO{" +
                "sns_no=" + sns_no +
                ", provider='" + provider + '\'' +
                ", provider_no='" + provider_no + '\'' +
                ", user_no=" + user_no +
                ", created_at='" + created_at + '\'' +
                '}';
    }
}
