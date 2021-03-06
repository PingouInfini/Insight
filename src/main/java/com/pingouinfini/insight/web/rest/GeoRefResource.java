package com.pingouinfini.insight.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.pingouinfini.insight.domain.map.MapData;
import com.pingouinfini.insight.service.GeoRefService;
import com.pingouinfini.insight.service.dto.GeoRefDTO;
import com.pingouinfini.insight.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by GFOLGOAS on 15/02/2019.
 */
@RestController
@RequestMapping("/api")
public class GeoRefResource {
    private final Logger log = LoggerFactory.getLogger(GeoRefResource.class);
    private final GeoRefService geoRefService;

    public GeoRefResource(GeoRefService geoRefService) {
        this.geoRefService = geoRefService;
    }

    /**
     * SEARCH  /map/_search/georef?query=:query : search for the georefs corresponding
     * to the query.
     *
     * @param query the query of the georef search
     * @return the result of the search
     */
    @GetMapping("/map/_search/georef")
    @Timed
    public ResponseEntity<List<MapData>> searchGeoRef(@RequestParam String query) {
        log.debug("REST request to search for a page of Locations for query {}", query);
        Page<GeoRefDTO> page = geoRefService.search(query);
        List<MapData> mapDto = page.getContent().stream().map(geoRef -> {
            MapData dto = new MapData();
            dto.setId(geoRef.getId());
            if (geoRef.getProperties() != null) {
                String countryCode = geoRef.getProperties().get("countrycode");
                dto.setLabel(geoRef.getName() + " [" + countryCode + "]");
            } else {
                dto.setLabel(geoRef.getName());
            }
            List<Double> coordLatLon = new ArrayList<>(geoRef.getLocation());
            // Reverse ordre de lont-lat en lat-lon pour avoir m??me structure que RawDataCoordinate
            Collections.reverse(coordLatLon);
            dto.setCoordinate(coordLatLon);
            dto.setObjectType("geoMarker");
            return dto;
        }).collect(Collectors.toList());
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/georef");
        return new ResponseEntity<>(mapDto, headers, HttpStatus.OK);
    }
}
