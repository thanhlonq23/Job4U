package com.nguyenlonq23.job4userver.service;

import com.nguyenlonq23.job4userver.model.entity.Location;
import com.nguyenlonq23.job4userver.repository.LocationRepositoty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Lazy
@Service
public class LocationService {
    LocationRepositoty locationRepositoty;

    @Autowired
    public LocationService(LocationRepositoty locationRepositoty) {
        this.locationRepositoty = locationRepositoty;
    }

    public List<Location> getAllLocations() {
        return locationRepositoty.findAll();
    }
}
