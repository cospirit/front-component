export interface Owner {
    uuid: string | null;
    owner?: {
        uuid: string
        fullName: string;
        logoBase64: string | null;
        parent: { uuid: string } | null;
    };
    features?: string[];
}
