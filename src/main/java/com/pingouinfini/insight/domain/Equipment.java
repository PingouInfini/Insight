package com.pingouinfini.insight.domain;

import com.pingouinfini.insight.domain.enumeration.EquipmentType;
import com.pingouinfini.insight.domain.map.GeometryCollection;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Equipment.
 */
@Document(collection = "equipment")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "equipment")
public class Equipment extends InsightEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    @Mapping(mappingPath = "/mappings/asset_id_mapping.json")
    private String id;

    @NotNull
    @Field("equipment_name")
    private String equipmentName;

    @Field("equipment_description")
    private String equipmentDescription;

    @Field("equipment_type")
    private EquipmentType equipmentType;

    @Field("equipment_coordinates")
    private String equipmentCoordinates;

    @Field("geometry")
    @Mapping(mappingPath = "/mappings/asset_geometry_mapping.json")
    private GeometryCollection geometry;

    @Field("equipment_symbol")
    private String equipmentSymbol;

    @Field("equipment_image")
    private byte[] equipmentImage;

    @Field("equipment_image_content_type")
    private String equipmentImageContentType;

    @Field("external_id")
    private String externalId;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public Equipment equipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
        return this;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getEquipmentDescription() {
        return equipmentDescription;
    }

    public Equipment equipmentDescription(String equipmentDescription) {
        this.equipmentDescription = equipmentDescription;
        return this;
    }

    public void setEquipmentDescription(String equipmentDescription) {
        this.equipmentDescription = equipmentDescription;
    }

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public Equipment equipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
        return this;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getEquipmentCoordinates() {
        return equipmentCoordinates;
    }

    public Equipment equipmentCoordinates(String equipmentCoordinates) {
        this.equipmentCoordinates = equipmentCoordinates;
        return this;
    }

    public void setEquipmentCoordinates(String equipmentCoordinates) {
        this.equipmentCoordinates = equipmentCoordinates;
    }

    public String getEquipmentSymbol() {
        return equipmentSymbol;
    }

    public Equipment equipmentSymbol(String equipmentSymbol) {
        this.equipmentSymbol = equipmentSymbol;
        return this;
    }

    public void setEquipmentSymbol(String equipmentSymbol) {
        this.equipmentSymbol = equipmentSymbol;
    }

    public byte[] getEquipmentImage() {
        return equipmentImage;
    }

    public Equipment equipmentImage(byte[] equipmentImage) {
        this.equipmentImage = equipmentImage;
        return this;
    }

    public void setEquipmentImage(byte[] equipmentImage) {
        this.equipmentImage = equipmentImage;
    }

    public String getEquipmentImageContentType() {
        return equipmentImageContentType;
    }

    public Equipment equipmentImageContentType(String equipmentImageContentType) {
        this.equipmentImageContentType = equipmentImageContentType;
        return this;
    }

    public void setEquipmentImageContentType(String equipmentImageContentType) {
        this.equipmentImageContentType = equipmentImageContentType;
    }

    public String getExternalId() {
        return externalId;
    }

    public Equipment externalId(String externalId) {
        this.externalId = externalId;
        return this;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    public GeometryCollection getGeometry() {
        return geometry;
    }

    public void setGeometry(GeometryCollection geometry) {
        this.geometry = geometry;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Equipment equipment = (Equipment) o;
        if (equipment.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), equipment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Equipment{" +
            "id=" + getId() +
            ", equipmentName='" + getEquipmentName() + "'" +
            ", equipmentDescription='" + getEquipmentDescription() + "'" +
            ", equipmentType='" + getEquipmentType() + "'" +
            ", equipmentCoordinates='" + getEquipmentCoordinates() + "'" +
            ", equipmentSymbol='" + getEquipmentSymbol() + "'" +
            ", equipmentImage='" + getEquipmentImage() + "'" +
            // ", geometry='" + getGeometry().toString() + "'" +
            ", equipmentImageContentType='" + getEquipmentImageContentType() + "'" +
            ", externalId='" + getExternalId() + "'" +
            "}";
    }
}
