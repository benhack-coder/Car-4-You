package ch.bbcag.bel.loginServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "authorization")
public class Authorization {
    @Id
    private String id;
    private String uuid;
    private Instant createdAt;

    public Authorization(String uuid) {
        this.uuid = uuid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Instant getDate() {
        return createdAt;
    }

    public void setDate(Instant date) {
        this.createdAt = date;
    }
}
