import "@/app/global.css"
import { useState, useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import Input, { DateInput, InputVerified, SelectInput } from "@/components/ui/Input";
import InputGroup from "@/components/layouts/InputGroup";
import { Button } from "@/components/ui/Button";
import { GENDERS } from "@/constants/Enum";
import LayoutWithBottomButton from "@/components/layouts/layout/LayoutWithBottomButton";

export default function () {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<User,"role" | "business" | "password" | "id" | "createdAt">>({
    firstname: "",
    lastname: "",
    birthdate: new Date(),
    gender: "M",
    email: { isVerified: false, value: "" },
    phone: { isVerified: false, value: "" },
  });

  // Synchroniser avec les données utilisateur quand elles changent
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname ?? "",
        lastname: user.lastname ?? "",
        birthdate: user.birthdate ?? new Date(),
        gender: user.gender ?? "M",
        email: user.email ?? { isVerified: false, value: "" },
        phone: user.phone ?? { isVerified: false, value: "" },
      });
      
    }
  }, [user]);

  return (
    <LayoutWithBottomButton buttons={[
      <Button title="Enregistrer" fullWidth disabled />
    ]}>
      <View className="pt-10">
        <InputGroup title="Informations personnelles">
          <Input
            label="Mon nom"
            type="text"
            value={formData.lastname}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastname: text }))}
            placeholder="Nom"
          />
          <Input
            label="Mon prénom"
            type="text"
            value={formData.firstname}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstname: text }))}
            placeholder="Prénom"
          />
          <DateInput
            label="Ma date de naissance"
            value={formData.birthdate}
            onChange={(date) => setFormData(prev => ({ ...prev, birthdate: date }))}
          />
          <SelectInput
            label="Sexe"
            options={GENDERS}
            value={formData.gender}
            onChange={(val) => setFormData(prev => ({ ...prev, gender: val as GenderValue }))}
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
            }}
            onVerify={() => {
              setFormData(prev => ({
                ...prev,
                email: { ...prev.email, isVerified: true }
              }));
            }}
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
            }}
            onVerify={() => {
              setFormData(prev => ({
                ...prev,
                phone: { ...prev.phone, isVerified: true }
              }));
            }}
          />
        </InputGroup>
      </View>
    </LayoutWithBottomButton>

  );
}