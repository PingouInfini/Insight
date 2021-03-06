package com.pingouinfini.insight.repository.search;

import com.pingouinfini.insight.domain.GeoRef;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Created by GFOLGOAS on 15/02/2019.
 * Spring Data Elasticsearch repository for the GeoRef entity.
 */
public interface GeoRefSearchRepository extends ElasticsearchRepository<GeoRef, String> {
}
