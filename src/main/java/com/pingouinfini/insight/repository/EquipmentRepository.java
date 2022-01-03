package com.pingouinfini.insight.repository;

import com.pingouinfini.insight.domain.Equipment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


/**
 * Spring Data MongoDB repository for the Equipment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipmentRepository extends MongoRepository<Equipment, String> {

}
