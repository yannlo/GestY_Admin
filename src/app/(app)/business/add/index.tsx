import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import LayoutWithBottomButton from "@/components/layouts/Layout/LayoutWithBottomButtonScrollable";
import { View } from "react-native";
import InputGroup from "@/components/layouts/InputGroup";
import Input, { ToggleInput } from "@/components/ui/Input";
import { useFormData } from "@/contexts/FormDataContext";
import { ErrorMessage } from "@/components/ui/Input/ErrorMessage";
import { router } from "expo-router";
import LoadingScreen from "@/components/layouts/LoadingScreen";
import { useZodForm } from "@/hooks/useZodForm";
import { createBusinessBaseSchema } from "@/schemas/businessSchema";
import LocationInput from "@/components/pages/businessAdd/LocationInput";
import OptionsInputGroup from "@/components/pages/businessAdd/OptionsInputGroup";
import CategoriesInput from "@/components/pages/businessAdd/CategoriesInput";


const AVAILABLE_ACTIVITIES: Record<ActivityValue, boolean> = {
  retail: process.env.EXPO_PUBLIC_RETAIL_IS_AVAILABLE === "true",
  wholesale: process.env.EXPO_PUBLIC_WHOLESALE_IS_AVAILABLE === "true",
  transfer: process.env.EXPO_PUBLIC_TRANSFER_IS_AVAILABLE === "true",
}

const businessBaseSchema = createBusinessBaseSchema(AVAILABLE_ACTIVITIES);

export default function () {

  const { formData, setFormData } = useFormData<BusinessForm>();
  const [isFormReady, setIsFormReady] = useState<boolean>(false);
  const putFormToReady = useCallback(() => setIsFormReady(true), []);

  const { getError, validateField, validateAll } = useZodForm(formData, businessBaseSchema);

  const handleSubmit = () => {
    if (!validateAll()) return;
    
    // TODO: soumission du formulaire
    router.push("/business/add/account");
  };

  const toggleOption = (option: OptionState) => {
    const key = (Object.keys(formData.options) as OptionValue[]).find(
      (k) => formData.options[k] === option
    );
    if (!key) return;
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: {
          ...prev.options[key],
          state: !prev.options[key].state,
        },
      },
    }));
  };


  return (
    <LayoutWithBottomButton buttons={[
      <Button key="continue" title="Continuer" fullWidth onPress={handleSubmit} />
    ]}>
      <View className="w-full pt-10">
        <InputGroup title="Informations de l'entreprise">
          <Input
            label="Nom"
            type="text"
            required
            value={formData.name}
            onChangeText={(text) => { setFormData(prev => ({ ...prev, name: text })); validateField("name"); }}
            error={getError("name")}
            placeholder="Nom"
          />

          <CategoriesInput
            putFormToReady={putFormToReady}
            categoriesForm={formData.categories}
            setCategories={(categories) => {
              setFormData(prev => ({ ...prev, categories }));
              validateField("categories");
            }}
            required
            error={getError("categories")}
          />

          <LocationInput
            value={formData.location}
            onAddPress={() => router.push("/business/add/map")}
            onRemove={() => setFormData(prev => ({ ...prev, location: null as unknown as BusinessForm["location"] }))}
            required
            error={getError("location")}
          />

        </InputGroup>

        <InputGroup title="Types d'activités *">
          <ErrorMessage error={getError("activities")} />
          <ToggleInput
            label="Vente en détail"
            isToggled={formData.activities.retail && AVAILABLE_ACTIVITIES.retail}
            isDisabled={!AVAILABLE_ACTIVITIES.retail}
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                activities: {
                  ...prev.activities,
                  retail: !prev.activities.retail
                }
              })); validateField("activities");
            }} />
          <ToggleInput
            label="Vente en gros"
            isToggled={formData.activities.wholesale && AVAILABLE_ACTIVITIES.wholesale}
            isDisabled={!AVAILABLE_ACTIVITIES.wholesale}
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                activities: {
                  ...prev.activities,
                  wholesale: !prev.activities.wholesale
                }
              })); validateField("activities");
            }} />
          <ToggleInput
            label="Vente de transfert et souscription"
            isToggled={formData.activities.transfer && AVAILABLE_ACTIVITIES.transfer}
            isDisabled={!AVAILABLE_ACTIVITIES.transfer}
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                activities: {
                  ...prev.activities,
                  transfer: !prev.activities.transfer
                }
              })); validateField("activities");
            }} />
        </InputGroup>

        <OptionsInputGroup
          options={formData.options}
          activities={formData.activities}
          onToggleOption={toggleOption}
        />
      </View>

      <LoadingScreen isLoading={!isFormReady} />
    </LayoutWithBottomButton>

  );
}


