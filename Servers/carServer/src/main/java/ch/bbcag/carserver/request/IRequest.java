package ch.bbcag.carserver.request;

import java.io.IOException;
import java.util.Map;

public interface IRequest {
    Map<String, String> makeRequest() throws IOException;
}
