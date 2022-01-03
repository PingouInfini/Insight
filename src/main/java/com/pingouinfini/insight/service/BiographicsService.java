package com.pingouinfini.insight.service;

import com.pingouinfini.insight.service.dto.BiographicsDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Biographics.
 */
public interface BiographicsService {

    /**
     * Save a biographics.
     *
     * @param biographicsDTO the entity to save
     * @return the persisted entity
     */
    BiographicsDTO save(BiographicsDTO biographicsDTO);

    /**
     * Get all the biographics.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<BiographicsDTO> findAll(Pageable pageable);


    /**
     * Get the "id" biographics.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<BiographicsDTO> findOne(String id);

    /**
     * Delete the "id" biographics.
     *
     * @param id the id of the entity
     */
    void delete(String id);

    /**
     * Search for the biographics corresponding to the query.
     *
     * @param query the query of the search
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<BiographicsDTO> search(String query, Pageable pageable);
}
