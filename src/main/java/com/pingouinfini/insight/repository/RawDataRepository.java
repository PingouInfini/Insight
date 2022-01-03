package com.pingouinfini.insight.repository;

import com.pingouinfini.insight.domain.RawData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the RawData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RawDataRepository extends MongoRepository<RawData, String> {
}
