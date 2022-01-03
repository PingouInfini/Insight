package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.Equipment;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Equipment entity.
 */
public interface EquipmentSearchRepository extends ElasticsearchRepository<Equipment, String> {
}
