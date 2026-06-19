
 interface BaseEnum<T> {
    label: string,
    value: T
}


type GenderValue = "M" | "F" | "O"; 
interface Gender extends BaseEnum<GenderValue> {}

type RoleValue = "admin" | "owner" | "manager_base" | "manager_full" | "seller"; 
interface Role extends BaseEnum<RoleValue> {}

