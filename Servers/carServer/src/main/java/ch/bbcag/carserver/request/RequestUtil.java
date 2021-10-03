package ch.bbcag.carserver.request;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class RequestUtil implements IRequest {
    private final String urlString;
    private final String json;
    private final RequestType requestType;
    private final String token;

    public RequestUtil(String url, String json, RequestType requestType, String token) {
        this.urlString = url;
        this.json = json;
        this.requestType = requestType;
        this.token = token;
    }

    @Override
    public Map<String, String> makeRequest() {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod(requestType.toString());
            connection.setRequestProperty("Accept", "application/*");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("Authorization", token);
            connection.setDoOutput(true);

            if (json.length() != 0) {
                convertToBytes(connection);
            }

            return fetchResponse(connection);
        } catch (IOException e) {
            return null;
        }
    }

    private void convertToBytes(HttpURLConnection connection) {
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = json.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Map<String, String> fetchResponse(HttpURLConnection connection) {
        try {
            if (connection.getResponseCode() != 200) {
                return null;
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder response = new StringBuilder();
            String responseLine;

            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            Map<String, String> map = new HashMap<>();
            map.put("response", response.toString());

            if (!(connection.getHeaderField("Username") == null)) {
                map.put("username", connection.getHeaderField("Username"));
            }
            return map;
        } catch (IOException e) {
            return null;
        }
    }
}
