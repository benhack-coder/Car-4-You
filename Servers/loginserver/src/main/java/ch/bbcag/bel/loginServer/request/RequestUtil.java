package ch.bbcag.bel.loginServer.request;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class RequestUtil implements IRequest {
    private final String urlString;
    private final String json;
    private final RequestType requestType;

    public RequestUtil(String url, String json, RequestType requestType) {
        this.urlString = url;
        this.json = json;
        this.requestType = requestType;
    }

    @Override
    public String makeEmailServerRequest(String to, String from, String carName, String text, String start_date, String end_date, String price) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod(requestType.toString());
            connection.setRequestProperty("Accept", "application/*");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("to", to);
            connection.setRequestProperty("from", from);
            connection.setRequestProperty("car", carName);
            connection.setRequestProperty("emailText", text);
            connection.setRequestProperty("start_date", start_date);
            connection.setRequestProperty("end_date", end_date);
            connection.setRequestProperty("price", price);
            connection.setDoOutput(true);

            if (json.length() != 0) {
                convertToBytes(connection);
            }
            return fetchResponse(connection);
        } catch (IOException e) {
            return null;
        }
    }

    public String makeCarServerRequest(String userName) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod(requestType.toString());
            connection.setRequestProperty("Accept", "application/*");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("userName", userName);
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

    private String fetchResponse(HttpURLConnection connection) {
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
            return response.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
