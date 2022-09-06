export interface ApiPlatformData {
    "@context": string;
    "@id": string;
    "@type": string;
}

export interface ApiPlatformArrayData extends ApiPlatformData {
    "hydra:member": any[];
    "hydra:totalItems": number;
}
