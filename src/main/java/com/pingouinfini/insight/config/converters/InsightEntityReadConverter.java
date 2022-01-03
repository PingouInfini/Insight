package com.pingouinfini.insight.config.converters;

import com.pingouinfini.insight.domain.InsightEntity;
import com.pingouinfini.insight.domain.RawData;
import com.pingouinfini.insight.domain.enumeration.InsightEntityType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.Nullable;

/**
 * Created by gFolgoas on 27/02/2019.
 */
@ReadingConverter
public class InsightEntityReadConverter implements Converter<Document, InsightEntity> {

    @Nullable
    @Override
    public InsightEntity convert(Document document) {

        RawData rawData = new RawData();
        rawData.setEntityType(InsightEntityType.RawData);
        return rawData;
    }
}
