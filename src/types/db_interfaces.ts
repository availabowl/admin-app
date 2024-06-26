export type School = {
    id: string;
    schoolname: string;
    schoolstate: string;
    isdraft: boolean;
    schoolphoto: string;
    schoolimage: string;
    averagerating: string;
    numreviews: number;
    uriencodedname: string;
    deleted?: boolean;
    num_dhs: number;
};

export type Dh = {
    id: string;
    dhname: string;
    dhphoto: string;
    numreviews: string;
    averagerating: number;
    uriencodedname: string;
    schoolid: string;
    isdraft: boolean;
    num_vendors: number;
    is_archived: boolean;
};

export type Vendor = {
    success?: boolean;
    id: string;
    vendoricon: string;
    vendorname: string;
    vendorphoto: string;
    uriencodedname: string;
    vendorcategory: string;
    overridevendoricon: boolean;
    overridevendorphoto: boolean;
    schoolid: string;
    dhid: string;
    averagerating: string;
    numreviews: number;
    isdraft: boolean;
};

export type FormSubmitResponse = {
    success: boolean;
    error?: string;
    schoolId?: string;
    dhId?: string;
    vendorId?: string;
    deletedAsset?: boolean;
};

export type AuthUser = {
    email: string;
    imageurl: string;
    uses_bcrypt?: boolean;
    id: string;
    username: string;
    bcrypt_password: string;
};
