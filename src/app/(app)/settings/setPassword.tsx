import "@/app/global.css"
import { useState, useCallback } from "react";
import { View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import InputGroup from "@/components/layouts/InputGroup";
import { Button } from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import LayoutWithBottomButton from "@/components/layouts/Layout/LayoutWithBottomButtonScrollable";
import { updatePassword } from "@/services/accountApi";
import { z } from "zod";
import { useZodForm } from "@/hooks/useZodForm";

const setPasswordSchema = z
  .object({
    current: z.string().min(1, "Le mot de passe actuel est obligatoire"),
    newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
    confirm: z.string().min(1, "La confirmation est obligatoire"),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"],
  });

export default function () {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ current: "", newPassword: "", confirm: "" });
  const { getError, validateField, validateAll, isValid } = useZodForm(formData, setPasswordSchema);

  const { mutate: submit, isPending, isError, error: mutationError } = useMutation({
    mutationFn: () => {
      if (!user) throw new Error("Utilisateur non connecté");
      return updatePassword(user.id, formData.current, formData.newPassword);
    },
    onSuccess: (result) => {
      if (result.success) {
        router.back();
      }
    },
  });

  const handleSubmit = useCallback(() => {
    if (!validateAll()) return;
    submit();
  }, [validateAll, submit]);

  const apiError = isError ? (mutationError as Error)?.message : undefined;

  return (
    <LayoutWithBottomButton buttons={[
      <Button key="save" title="Enregistrer" fullWidth disabled={!isValid || isPending} isLoading={isPending} onPress={handleSubmit} />
    ]}>
      <View className="flex-1 pt-10 pb-5">
        {apiError && <Alert variant="danger" message={apiError} className="mx-4 mb-4" />}
        <InputGroup title="Modifier le mot de passe">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={formData.current}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, current: text }));
              validateField("current");
            }}
            error={getError("current")}
            required
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={formData.newPassword}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, newPassword: text }));
              validateField("newPassword");
            }}
            error={getError("newPassword")}
            required
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={formData.confirm}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, confirm: text }));
              validateField("confirm");
            }}
            error={getError("confirm")}
            required
          />
        </InputGroup>
      </View>
    </LayoutWithBottomButton>
  );
}


