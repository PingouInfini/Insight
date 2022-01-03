package com.pingouinfini.insight.service;

import com.pingouinfini.insight.domain.kibana.EntityMappingInfo;
import com.pingouinfini.insight.domain.kibana.KibanaDashboardGenerationParameters;
import com.pingouinfini.insight.service.dto.KibanaObjectReferenceDTO;

import java.util.List;
import java.util.Set;

/**
 * Created by GFOLGOAS on 04/04/2019.
 */
public interface InsightKibanaService {
    void generateAndPostKibanaDashboard(final KibanaDashboardGenerationParameters dashboardParameters);

    List<KibanaObjectReferenceDTO> getDashboardRef();

    Set<EntityMappingInfo> getEntitiesMappingInfo();

    void deleteAllDashboard();

    void deleteSingleKibanaObject(final String objectId);
}
