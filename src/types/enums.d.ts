
 interface BaseEnum<T> {
    label: string,
    value: T
}


type GenderValue = "M" | "F" | "O"; 
interface Gender extends BaseEnum<GenderValue> {}

type RoleValue = "admin" | "owner" | "manager_base" | "manager_full" | "seller"; 
interface Role extends BaseEnum<RoleValue> {}

type ActivityValue = "retail" | "wholesale" | "transfer"; 
interface Activity extends BaseEnum<ActivityValue> {}


type OptionValue = "deferredPayment" | "sellerSaleEditing" | "slateManagement" | "consignmentManagement"; 
interface Option extends BaseEnum<OptionValue> {}