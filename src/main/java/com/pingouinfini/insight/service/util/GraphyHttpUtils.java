package com.pingouinfini.insight.service.util;

import com.pingouinfini.insight.service.dto.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Arrays;

public class GraphyHttpUtils {
    public static HttpHeaders getBasicHeaders() {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        return headers;
    }

    public static String getGraphyEndpointUrl(Object o) {
        if (o instanceof BiographicsDTO) {
            return "biographics";
        } else if (o instanceof LocationDTO) {
            return "locations";
        } else if (o instanceof OrganisationDTO) {
            return "organisations";
        } else if (o instanceof RawDataDTO) {
            return "raw-data";
        } else if (o instanceof EventDTO) {
            return "events";
        } else if (o instanceof EquipmentDTO) {
            return "equipment";
        } else {
            return null;
        }
    }
}
