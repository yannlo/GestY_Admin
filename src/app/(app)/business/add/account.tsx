import { Button } from "@/components/ui/Button";
import LayoutWithBottomButton from "@/components/layouts/Layout/LayoutWithBottomButtonScrollable";
import { View } from "react-native";
import InputGroup from "@/components/layouts/InputGroup";
import Input, { RadioInput } from "@/components/ui/Input";
import { useFormData } from "@/contexts/FormDataContext";
import { router } from "expo-router";
import { useZodForm } from "@/hooks/useZodForm";
import { accountSchema } from "@/schemas/businessSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusiness } from "@/services/businessApi";
import Alert from "@/components/ui/Alert";
import ThemedText from "@/components/ui/ThemedText";


export default function () {

  const { formData, setFormData } = useFormData<BusinessForm>();
  const { getError, validateAll } = useZodForm(formData.account, accountSchema);

  const queryClient = useQueryClient();
  const { mutate: submitBusiness, isPending, isError, error: submitError } = useMutation({
    mutationFn: createBusiness,
    onSuccess: (business) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      router.dismissAll();
      router.replace({ pathname: "/", params: { businessId: business.id } });
    },
  });

  const handleSubmit = () => {
    if (!validateAll()) return;
    submitBusiness(formData);
  };

  return (
    <LayoutWithBottomButton buttons={[
      <Button key="submit" title="Confirmer" fullWidth onPress={handleSubmit} isLoading={isPending} />
    ]}>
      <View className="w-full pt-10">
        {isError && (
          <Alert variant="danger" message={submitError?.message ?? "Une erreur est survenue lors de la création de l'entreprise."} className="mb-4 mx-4" />
        )}
        <View className="w-full mb-8 px-4 ">
          <ThemedText color="gray900">
            Veuillez sélectionner le type de compte et ajouter les informations de connexion.
          </ThemedText>
        </View>
        <InputGroup title="Type de compte">

          <RadioInput
            options={[
              { label: "Propriétaire", value: "owner" },
              { label: "Manager", value: "manager_full" },
            ]}
            value={formData.account.role}
            onChange={(role) => setFormData(prev => ({ ...prev, account: { ...prev.account, role } }))}
            error={getError("role")}
            required
          />

        </InputGroup>
        <InputGroup title="Information de connexion">
          <Alert variant="info" message="Vous devez renseigner au moins l'un de ces deux champs pour ajouter un compte." />

          <Input
            label="Email"
            type="email"
            value={formData.account.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, account: { ...prev.account, email: text } }))}
            error={getError("email")}
            placeholder="email@exemple.com"
          />
          <Input
            label="Téléphone"
            type="phone"
            value={formData.account.phone}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, account: { ...prev.account, phone: text } }))
            }}
            error={getError("phone")}
            placeholder="0X XX XX XX XX"
          />
        </InputGroup>
      </View>
    </LayoutWithBottomButton>
  );
}
