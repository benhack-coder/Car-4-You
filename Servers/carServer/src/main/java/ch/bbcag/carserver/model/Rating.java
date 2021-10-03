package ch.bbcag.carserver.model;

import org.springframework.data.annotation.Id;

public class Rating {

    @Id
    private String id;
    private String userName;
    private String text;
    private int numStars;

    public Rating(String id, String userName, String text, int numStars) {
        this.id = id;
        this.userName = userName;
        this.text = text;
        this.numStars = numStars;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNumStars() {
        return numStars;
    }

    public void setNumStars(int numStars) {
        this.numStars = numStars;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
