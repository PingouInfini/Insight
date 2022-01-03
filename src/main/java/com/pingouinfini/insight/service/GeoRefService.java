package com.pingouinfini.insight.service;

import com.pingouinfini.insight.service.dto.GeoRefDTO;
import org.springframework.data.domain.Page;

/**
 * Created by GFOLGOAS on 15/02/2019.
 */
public interface GeoRefService {
    /**
     * Search for the GeoRef corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    Page<GeoRefDTO> search(String query);
}
