package ch.bbcag.bel.loginServer.request;

import java.io.IOException;


public interface IRequest {
    String makeEmailServerRequest(String to, String from, String carName, String text, String start_date, String end_date, String price) throws IOException;
    String makeCarServerRequest(String userName);
}
