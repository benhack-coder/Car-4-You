package ch.bbcag.emailServer.controller;

import ch.bbcag.emailServer.SendEmail;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {
    private SendEmail sendEmail;

    public EmailController(SendEmail sendEmail) {
        this.sendEmail = sendEmail;
    }

    @GetMapping("/send")
    public int sendEmail(@RequestHeader("to") String to,
                         @RequestHeader("from") String from,
                         @RequestHeader("car") String car,
                         @RequestHeader("emailText") String text,
                         @RequestHeader("start_date") String start_date,
                         @RequestHeader("end_date") String end_date,
                         @RequestHeader("price") String price
    ) {
        try {
            sendEmail.sendEmail(text, to, from, car, start_date, end_date, price);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }
}
