import PtfFeature from "./Ptf/PtfFeature";

export default interface Owner {
    uuid: string;
    canonicalName?: string;
    fullName?: string;
    logoBase64?: string | null;
    parent?: { uuid: string } | null;
    features?: PtfFeature[];
}
