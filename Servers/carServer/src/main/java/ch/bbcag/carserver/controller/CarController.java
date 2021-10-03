/**
 * Author: Lettieri Lorenzo, Bajrami Elion, Hollenstein Benjamin
 * Latest code change: 20.5.2021
 */

package ch.bbcag.carserver.controller;

import ch.bbcag.carserver.factory.ResponseEntityFactory;
import ch.bbcag.carserver.model.Car;
import ch.bbcag.carserver.model.Location;
import ch.bbcag.carserver.model.Rating;
import ch.bbcag.carserver.repository.CarRepository;
import ch.bbcag.carserver.request.IRequest;
import ch.bbcag.carserver.request.RequestType;
import ch.bbcag.carserver.request.RequestUtil;
import ch.bbcag.carserver.services.ImageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
public class CarController {
    private final CarRepository carRepository;
    private final ImageService imageService;

    public CarController(CarRepository carRepository, ImageService imageService) {
        this.carRepository = carRepository;
        this.imageService = imageService;
    }

    @PostMapping("/insertcar")
    public ResponseEntity<String> insertCar(@RequestHeader("Authorization") String token, @RequestParam("image") MultipartFile image,
                                            @RequestParam("brand") String brand,
                                            @RequestParam("model") String model,
                                            @RequestParam("fuel") String fuel,
                                            @RequestParam("km") int km,
                                            @RequestParam("year") int year,
                                            @RequestParam("dailyPrice") int dailyPrice,
                                            @RequestParam("location") Location location) {
        try {
            ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity("", null);
            } else {
                boolean isValid = checkResponse(map);
                if (!isValid) {
                    return factory.unauthorizedEntity("", buildHeaders(false, map));
                } else {
                    Car car = new Car(UUID.randomUUID().toString(), brand, model, fuel, km, year, dailyPrice, location);
                    car.setOwner(map.get("username"));
                    List<Rating> ratings = new ArrayList<>();
                    List<String> favourites = new ArrayList<>();
                    car.setFavourites(favourites);
                    car.setRatings(ratings);
                    String path = imageService.save(image);
                    car.setImageUrl(path);
                    carRepository.insert(car);

                    return factory.authorizedEntity(path, buildHeaders(true, map));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * This mapping returns an image from the server as a .jpg from a byte array
     */
    @GetMapping(value = "/getimage", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody
    byte[] getImage(@RequestParam("image") String imageName) {
        try {
            return imageService.getImage(imageName);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * This mapping fetches cars for the current user
     * Identifier: username read out of the JWT token by the authorization-server
     */
    @GetMapping("/usercar")
    public ResponseEntity<List<Car>> fetchCarsByUser(@RequestHeader("Authorization") String token) {
        ResponseEntityFactory<List<Car>> factory = new ResponseEntityFactory<>();

        try {
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity(null, buildHeaders(false, null));
            }
            boolean isValid = checkResponse(map);

            if (isValid) {
                String userName = map.get("username");
                List<Car> cars = carRepository.findAll();
                List<Car> filteredCars = new ArrayList<>();

                for (Car car : cars) {
                    if (car.getOwner().equals(userName)) {
                        filteredCars.add(car);
                    }
                }
                return factory.authorizedEntity(filteredCars, buildHeaders(true, map));
            } else {
                return factory.unauthorizedEntity(null, buildHeaders(false, map));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @DeleteMapping("/deletecar")
    public ResponseEntity<String> deleteCar(@RequestHeader("Authorization") String token, @RequestBody Car car) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();

        try {
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity(null, buildHeaders(false, null));
            }
            boolean isValid = checkResponse(map);

            if (isValid) {
                Optional<Car> carToDelete = carRepository.findById(car.getId());

                if (carToDelete.isPresent() && carToDelete.get().getOwner().equals(map.get("username"))) {
                    carRepository.delete(carToDelete.get());
                    return factory.authorizedEntity(null, buildHeaders(true, map));
                } else {
                    return factory.forbiddenEntity("", buildHeaders(true, map));
                }
            } else {
                return factory.unauthorizedEntity(null, buildHeaders(false, map));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * This deletes all cars of a certain user, in case he deletes his account
     * Identifier: username read out of the JWT token by the authorization-server
     */
    @DeleteMapping("/deletecarbyuser")
    public int deleteCarByUser(@RequestHeader("userName") String username) throws IOException {
        List<Car> carsToDelete = carRepository.fetchCarByOwner(username);
        List<Car> carsToRemoveFavourite = carRepository.fetchCarByFavourites(username);
        List<Car> carsToRemoveRating = carRepository.fetchCarByRatings(username);

        System.out.println(carsToRemoveRating);

        for (Car car : carsToRemoveFavourite) {
            for (String uname : car.getFavourites()) {
                if (uname.equals(username)) {
                    car.getFavourites().remove(username);
                    break;
                }
            }
            carRepository.save(car);
        }

        for (Car car : carsToRemoveRating) {
            car.getRatings().removeIf(rating -> rating.getUserName().equals(username));
            carRepository.save(car);
        }

        for (Car car : carsToDelete) {
            String imageURL = car.getImageUrl();
            imageService.deleteImage(imageURL.substring(42));

            carRepository.delete(car);
        }
        return 1;
    }

    @GetMapping("/filtercars")
    public ResponseEntity<List<Car>> filterBrand(@RequestHeader("Authorization") String token, @RequestHeader("filter") String filter, @RequestHeader("filtervalue") String filterValue) {
        ResponseEntityFactory<List<Car>> factory = new ResponseEntityFactory<>();

        if (token.equals("guest")) {
            return factory.authorizedEntity(carRepository.fetchCarByBrand(filter, filterValue), null);
        } else {
            try {
                Map<String, String> map = checkAuthorization(token);
                if (map == null) {
                    return factory.unauthorizedEntity(null, buildHeaders(false, null));
                } else {
                    boolean isValid = checkResponse(map);
                    if (isValid) {
                        String userName = map.get("username");
                        List<Car> cars = carRepository.fetchCarByBrand(filter, filterValue);
                        return getListResponseEntity(factory, map, userName, cars);
                    } else {
                        return factory.unauthorizedEntity(null, buildHeaders(false, map));
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    @GetMapping("/fetchratings")
    public ResponseEntity<List<Rating>> fetchRatings(@RequestHeader("Authorization") String token, @RequestHeader("id") String id) {
        ResponseEntityFactory<List<Rating>> factory = new ResponseEntityFactory<>();
        if (token.equals("guest")) {
            Optional<Car> car = carRepository.findById(id);
            if (car.isPresent())
                return factory.authorizedEntity(car.get().getRatings(), null);
            else {
                return factory.authorizedEntity(null, null);
            }
        } else {
            try {
                Map<String, String> map = checkAuthorization(token);
                if (map == null) {
                    return factory.unauthorizedEntity(null, buildHeaders(false, null));
                } else {
                    boolean isValid = checkResponse(map);
                    if (isValid) {
                        Optional<Car> car = carRepository.findById(id);
                        if (car.isPresent())
                            return factory.authorizedEntity(car.get().getRatings(), buildHeaders(true, map));
                        else {
                            return factory.authorizedEntity(null, null);
                        }
                    } else {
                        return factory.unauthorizedEntity(null, buildHeaders(false, map));
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    @GetMapping("/filterbyattributes")
    public ResponseEntity<List<Car>> filterAttributes(@RequestHeader("Authorization") String token, @RequestHeader("max") Optional<Integer> maxPrice, @RequestHeader("km") Optional<Integer> km, @RequestHeader("location") Optional<Location> location) {
        ResponseEntityFactory<List<Car>> factory = new ResponseEntityFactory<>();

        if (token.equals("guest")) {
            List<Car> cars = fetchCarsBasedOnHeaders(location, km, maxPrice);
            if (cars != null) {
                return factory.authorizedEntity(cars, null);
            } else {
                return factory.authorizedEntity(null, null);
            }
        } else {
            try {
                Map<String, String> map = checkAuthorization(token);
                if (map == null) {
                    return factory.unauthorizedEntity(null, buildHeaders(false, null));
                } else {
                    boolean isValid = checkResponse(map);
                    if (isValid) {
                        String userName = map.get("username");
                        List<Car> cars = fetchCarsBasedOnHeaders(location, km, maxPrice);
                        if (cars != null) {
                            return getListResponseEntity(factory, map, userName, cars);
                        } else {
                            return factory.authorizedEntity(null, buildHeaders(true, map));
                        }
                    } else {
                        return factory.unauthorizedEntity(null, buildHeaders(false, map));
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    @PostMapping("/addrating")
    public ResponseEntity<String> addRating(@RequestHeader("Authorization") String token, @RequestHeader("car") String id, @RequestBody Rating rating) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
        try {
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity(null, buildHeaders(false, null));
            } else {
                boolean isValid = checkResponse(map);
                if (isValid) {
                    String userName = map.get("username");
                    rating.setUserName(userName);
                    Optional<Car> car = carRepository.findById(id);
                    if (car.isPresent()) {
                        List<Rating> ratings = car.get().getRatings();
                        ratings.add(rating);
                        car.get().setRatings(ratings);
                        carRepository.deleteById(id);
                        carRepository.insert(car.get());
                        return factory.authorizedEntity(null, buildHeaders(true, map));
                    } else {
                        return factory.authorizedEntity("No car found", buildHeaders(true, map));
                    }
                } else {
                    return factory.unauthorizedEntity(null, buildHeaders(false, map));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * This mapping fetches all the favourite cars from a user
     */

    @GetMapping("/fetchfavourite")
    public ResponseEntity<List<Car>> fetchFavourite(@RequestHeader("Authorization") String token) {
        ResponseEntityFactory<List<Car>> factory = new ResponseEntityFactory<>();
        try {
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity(null, buildHeaders(false, null));
            } else {
                boolean isValid = checkResponse(map);
                if (isValid) {
                    String userName = map.get("username");
                    List<Car> cars = carRepository.fetchFavouritesByUsername(userName);
                    return factory.authorizedEntity(cars, buildHeaders(true, map));
                } else {
                    return factory.unauthorizedEntity(null, buildHeaders(false, map));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * This mapping removes or adds favourite cars to a user, based on the action header
     */

    @GetMapping("/managefavourite")
    public ResponseEntity<String> manageFavourites(@RequestHeader("Authorization") String token, @RequestHeader("car") String id, @RequestHeader("action") String action) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
        try {
            Map<String, String> map = checkAuthorization(token);
            if (map == null) {
                return factory.unauthorizedEntity(null, buildHeaders(false, null));
            } else {
                boolean isValid = checkResponse(map);
                if (isValid) {
                    String userName = map.get("username");
                    Optional<Car> car = carRepository.findById(id);
                    if (car.isPresent()) {
                        switch (action) {
                            case "add":
                                if (checkIfUserAlreadyLikes(userName, car.get().getFavourites())) {
                                    return factory.authorizedEntity("already liked", buildHeaders(true, map));
                                } else {
                                    car.get().addToFavourites(userName);
                                    carRepository.save(car.get());
                                    return factory.authorizedEntity("success", buildHeaders(true, map));
                                }
                            case "delete":
                                car.get().deleteFromFavourites(userName);
                                carRepository.save(car.get());
                                return factory.authorizedEntity("success", buildHeaders(true, map));
                        }
                    } else {
                        return factory.authorizedEntity("fail", buildHeaders(true, map));
                    }
                } else {
                    return factory.unauthorizedEntity(null, buildHeaders(false, map));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return null;
    }

    /**
     * This method checks if the cars don't belong to the user. If true, it will add it to a list and return it
     * This procedure is necessary, so the user can't see his own cars
     */
    private ResponseEntity<List<Car>> getListResponseEntity(ResponseEntityFactory<List<Car>> factory, Map<String, String> map, String userName, List<Car> cars) {
        List<Car> filteredCars = new ArrayList<>();

        for (Car car : cars) {
            if (!car.getOwner().equals(userName)) {
                filteredCars.add(car);
            }
        }
        return factory.authorizedEntity(filteredCars, buildHeaders(true, map));
    }

    /**
     * This method makes a request to the authorization-server
     */
    private Map<String, String> checkAuthorization(String token) throws IOException {
        IRequest request = new RequestUtil("http://localhost:8080/authorization", "", RequestType.GET, token);
        return request.makeRequest();
    }

    private boolean checkResponse(Map<String, String> map) {
        return !map.get("response").equals("0") && !map.get("response").equals("2");
    }

    private HttpHeaders buildHeaders(boolean valid, Map<String, String> map) {
        HttpHeaders headers = new HttpHeaders();
        if (valid) {
            headers.set("Authorization", map.get("response"));
        } else {
            headers.set("Authorization", "Invalid Auth");
        }
        return headers;
    }

    /**
     * This method checks which attributes are present
     * Based on that it makes a certain query to the DB
     */
    private List<Car> fetchCarsBasedOnHeaders(Optional<Location> location, Optional<Integer> km, Optional<Integer> maxPrice) {
        if (maxPrice.isPresent() && location.isPresent() && km.isPresent()) {
            return carRepository.fetchCarByAll(location.get(), km.get(), maxPrice.get());
        } else if (location.isPresent() && km.isEmpty() && maxPrice.isEmpty()) {
            return carRepository.fetchCarByLocation(location.get());
        } else if (km.isPresent() && location.isEmpty() && maxPrice.isEmpty()) {
            return carRepository.fetchCarBykm(km.get());
        } else if (maxPrice.isPresent() && km.isEmpty() && location.isEmpty()) {
            return carRepository.fetchCarByPrice(maxPrice.get() + 1);
        } else if (maxPrice.isPresent() && km.isPresent() && location.isEmpty()) {
            return carRepository.fetchCarByKmAndDailyPrice(km.get(), maxPrice.get());
        } else if (maxPrice.isPresent() && location.isPresent() && km.isEmpty()) {
            return carRepository.fetchCarByLocationAndDailyPrice(location.get(), maxPrice.get());
        } else if (maxPrice.isEmpty() && km.isPresent() && location.isPresent()) {
            return carRepository.fetchCarByKmAndLocation(location.get(), km.get());
        } else {
            return null;
        }
    }

    private boolean checkIfUserAlreadyLikes(String userName, List<String> favourites) {
        boolean check = false;
        for (String favourite : favourites) {
            if (favourite.equals(userName)) {
                check = true;
                break;
            }
        }
        return check;
    }
}