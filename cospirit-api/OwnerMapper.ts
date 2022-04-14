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

    private static featuresFromAttributeValues(attributeValues: AttributeValue[]): PtfFeature[] {
        console.log("attributes given to ownerMapper :", attributeValues);
        const features = attributeValues
            .filter((attributeValue) => attributeValue.attribute.code.startsWith("PTF_FEATURE"))
            .map((attributeValue) => this.featureFromAttributeValue(attributeValue));
        console.log("after mapping :", features);
        return features.filter((feature) => feature.enabled);
    }

    private static ptfOwnerFromAttributeValues(attributeValues: AttributeValue[]): string | null {
        const ptfOwner = attributeValues.find((attributeValue) => attributeValue.attribute.code === "PTF_OWNER_UUID");
        if (ptfOwner === undefined) {
            return null;
        }
        return ptfOwner.value;
    }

    public static ownerFromEntity(entity: Entity): Owner {
        return {
            features: this.featuresFromAttributeValues(entity.attributes),
            owner: {
                uuid: entity.uuid != null ? entity.uuid : "",
                fullName: entity.name != null ? entity.name : "",
                logoBase64: null,
                parent: {
                    uuid: entity.parent != null ? entity.parent : ""
                }
            },
            uuid: this.ptfOwnerFromAttributeValues(entity.attributes),

        };
    }

}
