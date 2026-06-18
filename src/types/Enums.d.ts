
 interface BaseEnum<T> {
    label: string,
    value: T
}


type GenderValue = "M" | "F" | "O"; 
interface Gender extends BaseEnum<GenderValue> {}
