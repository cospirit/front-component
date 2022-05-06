import Entity from "../universe/model/Entity";
import Owner from "./Owner";
import AttributeValue from "../universe/model/AttributeValue";
import PtfFeature from "./Ptf/PtfFeature";

const prefix = "PTF_FEATURE_";

export default class OwnerMapper {

    private static featureFromAttributeValue(attributeValue: AttributeValue): PtfFeature {
        console.log("featureFromAttributeValue", attributeValue);
        return {
            // code: attributeValue.attribute.code.substring(prefix.length),
            code: "PONEY", //FIXME
            // name: attributeValue.attribute.name,
            uuid: attributeValue.uuid,
            // enabled: attributeValue.value,
        };
    }

    private static featuresFromEntity(entity: Entity): PtfFeature[] {
        console.log("featuresFromEntity", entity);
        if (entity.attributes === undefined) {
            // console.trace("wut");
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
        console.log("attributes given to ownerMapper :", attributeValues);
        const features = attributeValues
            .filter((attributeValue) => attributeValue.attribute.code.startsWith(prefix))
            .filter((attributeValue) => attributeValue.value === true)
            .map((attributeValue) => this.featureFromAttributeValue(attributeValue));
        console.log("after mapping :", features);
        return features;
    }

    // private static ptfOwnerFromEntity(entity: Entity): string | null {
    //     if (entity.attributes === undefined) {
    //         return entity.overloadedAttributes.PTF_OWNER_UUID;
    //     }
    //     const attributeValues = entity.attributes;
    //     const ptfOwner = attributeValues.find((attributeValue) => attributeValue.attribute.code === "PTF_OWNER_UUID");
    //     if (ptfOwner === undefined) {
    //         return null;
    //     }
    //     return ptfOwner.value;
    // }

    // private static featuresAsStringFromEntity(entity: Entity): string[] {
    //     return this.featuresFromEntity(entity)
    //         .map((f) => f.name)
    //         .filter((f) => f.startsWith(prefix))
    //         .map((f) => f.substring(prefix.length))
    //         ;
    // }

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
