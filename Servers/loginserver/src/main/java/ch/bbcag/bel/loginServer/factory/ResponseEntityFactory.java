package ch.bbcag.bel.loginServer.factory;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

public class ResponseEntityFactory<T> {


    public ResponseEntity<T> authorizedEntity(T body, HttpHeaders headers) {
        return ResponseEntity.ok()
                .headers(headers)
                .body(body);
    }

    public ResponseEntity<T> unauthorizedEntity(T body, HttpHeaders headers) {
        return ResponseEntity.status(401)
                .headers(headers)
                .body(body);
    }
}
