import Entity from "./model/Entity";
import Attribute from "./model/Attribute";
import AttributeValue from "./model/AttributeValue";

export interface UniverseData {
    "@context": string;
    "@id": string;
    "@type": string;
}

export interface UniverseEntityArrayData extends UniverseData {
    "hydra:member": Entity[];
}

export interface UniverseAttributeData {
    id: string;
    name: string;
    code: string;
    inheritedFrom?: Entity;
    attribute: Attribute;
    attributeValue: AttributeValue;
}
