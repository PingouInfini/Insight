package com.pingouinfini.insight.repository.graphy;

import java.util.LinkedHashMap;

/**
 * Created by GFOLGOAS on 01/04/2019.
 */
public interface InsightGraphRelationCustomRepository {
    public void myDeleteById(String id);

    public LinkedHashMap findOne(String id);

    public void linkAll();
}
