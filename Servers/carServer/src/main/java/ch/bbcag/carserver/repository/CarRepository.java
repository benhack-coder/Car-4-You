package ch.bbcag.carserver.repository;

import ch.bbcag.carserver.model.Car;
import ch.bbcag.carserver.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CarRepository extends MongoRepository<Car, String> {

    @Query(value = "{'model' : ?0, 'km' : ?1}")
    Car fetchCar(String model, int km);

    @Query(value = "{'?0' : {$regex: ?1}}")
    List<Car> fetchCarByBrand(String filter, String filterValue);

    @Query(value = "{'dailyPrice' :  {$lt: ?0}}")
    List<Car> fetchCarByPrice(int max);

    @Query(value = "{'km' : {$lt: ?0}}")
    List<Car> fetchCarBykm(int km);

    @Query(value = "{'location' : ?0}")
    List<Car> fetchCarByLocation(Location location);

    @Query(value = "{'location' : ?0,'km' : {$lt: ?1},'dailyPrice' : {$lt: ?2}}")
    List<Car> fetchCarByAll(Location location, int km, int dailyPrice);

    @Query(value = "{'location' : ?0, 'km' : {$lt: ?1}}")
    List<Car> fetchCarByKmAndLocation(Location location, int km);

    @Query(value = "{'location' : ?0, 'dailyPrice' : {$lt: ?1}}")
    List<Car> fetchCarByLocationAndDailyPrice(Location location, int dailyPrice);

    @Query(value = "{'km' : {$lt: ?0}, 'dailyPrice' : {$lt: ?1}}")
    List<Car> fetchCarByKmAndDailyPrice(int km, int dailyPrice);

    @Query(value = "{'favourites' : {$in: [?0]}}")
    List<Car> fetchFavouritesByUsername(String username);

    @Query(value = "{'owner' : ?0}")
    List<Car> fetchCarByOwner(String username);

    @Query(value = "{'favourites': ?0}")
    List<Car> fetchCarByFavourites(String username);

    @Query(value = "{'ratings':{$elemMatch:{'userName':{$in:[?0]}}}}")
    List<Car> fetchCarByRatings(String username);
}
