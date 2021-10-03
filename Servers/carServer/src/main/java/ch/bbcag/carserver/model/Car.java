package ch.bbcag.carserver.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "car")
public class Car {
    @Id
    private String id;
    private String brand;
    private String model;
    private String fuel;
    private String owner;
    private String url;
    private int km;
    private int year;
    private int dailyPrice;
    private Location location;
    private List<Rating> ratings;
    private List<String> favourites;

    public Car(String id, String brand, String model, String fuel, int km, int year, int dailyPrice, Location location) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.fuel = fuel;
        this.km = km;
        this.year = year;
        this.dailyPrice = dailyPrice;
        this.location = location;
    }

    public List<String> getFavourites() {
        return favourites;
    }

    public void setFavourites(List<String> favourites) {
        this.favourites = favourites;
    }
    public void addToFavourites(String userName) {
        this.favourites.add(userName);
    }
    public void deleteFromFavourites(String userName) {
        this.favourites.remove(userName);
    }

    public int getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(int dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    public int getKm() {
        return km;
    }

    public void setKm(int km) {
        this.km = km;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getImageUrl() {
        return url;
    }

    public void setImageUrl(String url) {
        this.url = url;
    }

    public Location getLocation() {
        return location;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
