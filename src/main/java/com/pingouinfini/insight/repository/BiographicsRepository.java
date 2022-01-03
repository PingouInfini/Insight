package com.pingouinfini.insight.repository;

import com.pingouinfini.insight.domain.Biographics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Biographics entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BiographicsRepository extends MongoRepository<Biographics, String> {

}
