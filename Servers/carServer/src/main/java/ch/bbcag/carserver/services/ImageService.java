package ch.bbcag.carserver.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.UUID;

@Service
public class ImageService {
    private final String folder = readProperty("path");

    public ImageService() throws IOException {
    }

    public String save (MultipartFile image) throws IOException {
        String url = "http://www.lorenet.tk:8081/getimage?image=";
        byte[] bytes = image.getBytes();
        String randomUUID = UUID.randomUUID().toString();
        Path path = Paths.get(folder + randomUUID + ".jpg");
        Files.write(path, bytes);
        return url + randomUUID;
    }
    public byte[] getImage(String imageName) {
        try {
            return Files.readAllBytes(Paths.get(folder + imageName + ".jpg"));
        } catch (Exception e){
            return null;
        }
    }

    public void deleteImage(String imageName) throws IOException {
        Path imagePath = Paths.get(folder + imageName + ".jpg");
        Files.delete(imagePath);
    }

    private String readProperty(String propertyName) throws IOException {
        Properties prop = new Properties();

        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        InputStream is = cl.getResourceAsStream("config/config.properties");
        prop.load(is);
        return prop.getProperty(propertyName);
    }
}