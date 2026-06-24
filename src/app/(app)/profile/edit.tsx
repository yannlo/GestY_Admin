import "@/app/global.css"
import { useState, useEffect, useMemo, useCallback } from "react";
import { View } from "react-native";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import Input, { DateInput, InputVerified, SelectInput } from "@/components/ui/Input";
import InputGroup from "@/components/layouts/InputGroup";
import { Button } from "@/components/ui/Button";
import { GENDERS } from "@/constants/Enum";
import LayoutWithBottomButton from "@/components/layouts/Layout/LayoutWithBottomButtonScrollable";
import { DEFAULT_USER } from "@/constants/default";
import { useZodForm } from "@/hooks/useZodForm";
import { userFormSchema } from "@/schemas/userSchema";
import { updateUser } from "@/services/accountApi";

export default function () {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UserForm>(DEFAULT_USER);
  const { getError, validateField, isValid, validateAll } = useZodForm(formData, userFormSchema);
  const { mutate: submitUser, isPending } = useMutation({
    mutationFn: (data: UserForm) => {
      if (!user) throw new Error("Utilisateur non connecté");
      return updateUser(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.replace("/");
    },
  });

  // Synchroniser avec les données utilisateur quand elles changent
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      formData.lastname !== user.lastname ||
      formData.firstname !== user.firstname ||
      formData.birthdate.getTime() !== user.birthdate.getTime() ||
      formData.gender !== user.gender ||
      formData.email.value !== user.email.value ||
      formData.email.isVerified !== user.email.isVerified ||
      formData.phone.value !== user.phone.value ||
      formData.phone.isVerified !== user.phone.isVerified
    );
  }, [formData, user]);

  const handleSubmit = useCallback(() => {
    if (!validateAll() || !hasChanges) return;
    submitUser(formData);
  }, [validateAll, submitUser, formData, hasChanges]);

  return (
    <LayoutWithBottomButton buttons={[
      <Button key="save" title="Enregistrer" fullWidth disabled={!isValid || !hasChanges || isPending} onPress={handleSubmit} isLoading={isPending} />
    ]}>
      <View className="pt-10">
        <InputGroup title="Informations personnelles">
          <Input
            label="Mon nom"
            type="text"
            value={formData.lastname}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, lastname: text }));
              validateField("lastname");
            }}
            error={getError("lastname")}
            required
            placeholder="Nom"
          />
          <Input
            label="Mon prénom"
            type="text"
            value={formData.firstname}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, firstname: text }));
              validateField("firstname");
            }}
            error={getError("firstname")}
            required
            placeholder="Prénom"
          />
          <DateInput
            label="Ma date de naissance"
            value={formData.birthdate}
            onChange={(date) => {
              setFormData(prev => ({ ...prev, birthdate: date }));
              validateField("birthdate");
            }}
            error={getError("birthdate")}
            required
          />
          <SelectInput
            label="Sexe"
            options={GENDERS}
            value={formData.gender}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, gender: val as GenderValue }));
              validateField("gender");
            }}
            error={getError("gender")}
            required
          />
        </InputGroup>

        <InputGroup title="Informations de connexion">
          <InputVerified
            label="Mon email"
            type="email"
            verified={formData.email.isVerified}
            value={formData.email.value}
            onChangeText={(text) => {
              setFormData(prev => ({
                ...prev,
                email: { ...prev.email, value: text, isVerified: false }
              }));
              validateField("email");
            }}
            onVerify={() => {
              setFormData(prev => ({
                ...prev,
                email: { ...prev.email, isVerified: true }
              }));
            }}
            error={getError("email")}
            required
            placeholder="Email"
          />
          <InputVerified
            label="Mon téléphone"
            type="phone"
            verified={formData.phone.isVerified}
            value={formData.phone.value}
            onChangeText={(raw) => {
              setFormData(prev => ({
                ...prev,
                phone: { ...prev.phone, value: raw, isVerified: false }
              }));
              validateField("phone");
            }}
            onVerify={() => {
              setFormData(prev => ({
                ...prev,
                phone: { ...prev.phone, isVerified: true }
              }));
            }}
            error={getError("phone")}
            required
          />
        </InputGroup>
      </View>
    </LayoutWithBottomButton>
  );
}