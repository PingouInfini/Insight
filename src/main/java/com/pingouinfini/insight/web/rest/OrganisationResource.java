package com.pingouinfini.insight.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.pingouinfini.insight.service.OrganisationService;
import com.pingouinfini.insight.web.rest.errors.BadRequestAlertException;
import com.pingouinfini.insight.web.rest.util.HeaderUtil;
import com.pingouinfini.insight.web.rest.util.PaginationUtil;
import com.pingouinfini.insight.service.dto.OrganisationDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Organisation.
 */
@RestController
@RequestMapping("/api")
public class OrganisationResource {

    private final Logger log = LoggerFactory.getLogger(OrganisationResource.class);

    private static final String ENTITY_NAME = "organisation";

    private final OrganisationService organisationService;

    public OrganisationResource(OrganisationService organisationService) {
        this.organisationService = organisationService;
    }

    /**
     * POST  /organisations : Create a new organisation.
     *
     * @param organisationDTO the organisationDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new organisationDTO, or with status 400 (Bad Request) if the organisation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/organisations")
    @Timed
    public ResponseEntity<OrganisationDTO> createOrganisation(@Valid @RequestBody OrganisationDTO organisationDTO) throws URISyntaxException {
        log.debug("REST request to save Organisation : {}", organisationDTO);
        if (organisationDTO.getId() != null) {
            throw new BadRequestAlertException("A new organisation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrganisationDTO result = organisationService.save(organisationDTO);
        return ResponseEntity.created(new URI("/api/organisations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /organisations : Updates an existing organisation.
     *
     * @param organisationDTO the organisationDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated organisationDTO,
     * or with status 400 (Bad Request) if the organisationDTO is not valid,
     * or with status 500 (Internal Server Error) if the organisationDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/organisations")
    @Timed
    public ResponseEntity<OrganisationDTO> updateOrganisation(@Valid @RequestBody OrganisationDTO organisationDTO) throws URISyntaxException {
        log.debug("REST request to update Organisation : {}", organisationDTO);
        if (organisationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrganisationDTO result = organisationService.save(organisationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, organisationDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /organisations : get all the organisations.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of organisations in body
     */
    @GetMapping("/organisations")
    @Timed
    public ResponseEntity<List<OrganisationDTO>> getAllOrganisations(Pageable pageable) {
        log.debug("REST request to get a page of Organisations");
        Page<OrganisationDTO> page = organisationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/organisations");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /organisations/:id : get the "id" organisation.
     *
     * @param id the id of the organisationDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the organisationDTO, or with status 404 (Not Found)
     */
    @GetMapping("/organisations/{id}")
    @Timed
    public ResponseEntity<OrganisationDTO> getOrganisation(@PathVariable String id) {
        log.debug("REST request to get Organisation : {}", id);
        Optional<OrganisationDTO> organisationDTO = organisationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organisationDTO);
    }

    /**
     * DELETE  /organisations/:id : delete the "id" organisation.
     *
     * @param id the id of the organisationDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/organisations/{id}")
    @Timed
    public ResponseEntity<Void> deleteOrganisation(@PathVariable String id) {
        log.debug("REST request to delete Organisation : {}", id);
        organisationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/organisations?query=:query : search for the organisation corresponding
     * to the query.
     *
     * @param query the query of the organisation search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/organisations")
    @Timed
    public ResponseEntity<List<OrganisationDTO>> searchOrganisations(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Organisations for query {}", query);
        Page<OrganisationDTO> page = organisationService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/organisations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
