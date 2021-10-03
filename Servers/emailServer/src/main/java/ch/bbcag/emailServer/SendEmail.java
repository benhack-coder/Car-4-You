package ch.bbcag.emailServer;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SendEmail {

    private final JavaMailSender javaMailSender;

    public SendEmail(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String text, String to, String from, String carName, String start_date, String end_date, String price) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        String emailText =  "You have received a request for the car: " + carName +
                            "\nRequester: " + from +
                            "\nFrom: " + start_date +
                            "\nTo: " + end_date +
                            "\nRental Cost: " + price +
                            "\nHis text: \n" + text;

        simpleMailMessage.setFrom(from);
        simpleMailMessage.setTo(to);
        simpleMailMessage.setSubject("Request for a car");
        simpleMailMessage.setText(emailText);

        javaMailSender.send(simpleMailMessage);
    }
}
