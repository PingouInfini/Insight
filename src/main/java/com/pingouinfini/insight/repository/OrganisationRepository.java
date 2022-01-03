package com.pingouinfini.insight.repository;

import com.pingouinfini.insight.domain.Organisation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Organisation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganisationRepository extends MongoRepository<Organisation, String> {

}
