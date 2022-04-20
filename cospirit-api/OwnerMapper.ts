import Entity from "../universe/model/Entity";
import {Owner} from "./Owner";
import AttributeValue from "../universe/model/AttributeValue";
import {PtfFeature} from "./Ptf/PtfFeature";

export default class OwnerMapper {

    private static featureFromAttributeValue(attributeValue: AttributeValue): PtfFeature {
        return {
            code: attributeValue.attribute.code,
            name: attributeValue.attribute.name,
            enabled: attributeValue.value,
        };
    }

    private static featuresFromEntity(entity: Entity): PtfFeature[] {
        if (entity.attributes === undefined) {
            return Object.entries(entity.overloadedAttributes)
                .filter(([name, value]) => name.startsWith("PTF_FEATURE") && value === true)
                .map(([name, value]) => {
                    return {
                        code: name,
                        name,
                        enabled: true,
                    };
                });
        }
        const attributeValues = entity.attributes;
        console.log("attributes given to ownerMapper :", attributeValues);
        const features = attributeValues
            .filter((attributeValue) => attributeValue.attribute.code.startsWith("PTF_FEATURE"))
            .map((attributeValue) => this.featureFromAttributeValue(attributeValue));
        console.log("after mapping :", features);
        return features.filter((feature) => feature.enabled);
    }

    private static ptfOwnerFromEntity(entity: Entity): string | null {
        if (entity.attributes === undefined) {
            return entity.overloadedAttributes.PTF_OWNER_UUID;
        }
        const attributeValues = entity.attributes;
        const ptfOwner = attributeValues.find((attributeValue) => attributeValue.attribute.code === "PTF_OWNER_UUID");
        if (ptfOwner === undefined) {
            return null;
        }
        return ptfOwner.value;
    }

    private static featuresAsStringFromEntity(entity: Entity): string[] {
        const prefix = "PTF_FEATURE_";
        return this.featuresFromEntity(entity)
            .map((f) => f.name)
            .filter((f) => f.startsWith(prefix))
            .map((f) => f.substring(prefix.length))
            ;
    }

    public static ownerFromEntity(entity: Entity): Owner {
        return {
            features: this.featuresAsStringFromEntity(entity),
            owner: {
                uuid: entity.uuid != null ? entity.uuid : "",
                fullName: entity.name != null ? entity.name : "",
                logoBase64: null,
                parent: {
                    uuid: entity.parent != null ? entity.parent : ""
                }
            },
            uuid: this.ptfOwnerFromEntity(entity),

        };
    }

}
