import Entity from "../universe/model/Entity";
import Owner from "./Owner";
import AttributeValue from "../universe/model/AttributeValue";
import PtfFeature from "./Ptf/PtfFeature";

const prefix = "PTF_FEATURE_";

export default class OwnerMapper {

    private static featureFromAttributeValue(attributeValue: AttributeValue): PtfFeature {
        return {
            code: attributeValue.attribute.code.substring(prefix.length),
            // name: attributeValue.attribute.name,
            uuid: attributeValue.uuid,
            // enabled: attributeValue.value,
        };
    }

    private static featuresFromEntity(entity: Entity): PtfFeature[] {
        if (entity.attributes === undefined) {
            return Object.entries(entity.overloadedAttributes)
                .filter(([name, value]) => name.startsWith(prefix) && value === true)
                .map(([name, value]) => {
                    return {
                        code: name.substring(prefix.length),
                        // name,
                        uuid: name, // TODO use actual uuid ?
                        // enabled: true,
                    };
                });
        }
        const attributeValues = entity.attributes;
        return attributeValues
            .filter((attributeValue) => attributeValue.attribute.code.startsWith(prefix))
            .filter((attributeValue) => attributeValue.value === true)
            .map((attributeValue) => this.featureFromAttributeValue(attributeValue));
    }

    public static ownerFromEntity(entity: Entity): Owner {
        return {
            features: this.featuresFromEntity(entity),
            uuid: entity.uuid != null ? entity.uuid : "",
            canonicalName: entity.name != null ? entity.name : "",
            fullName: entity.name != null ? entity.name : "",
            logoBase64: null,
            parent: entity.parent != null ? {
                uuid:  entity.parent
            } : null,
        };
    }

}
