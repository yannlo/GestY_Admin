import "@/app/global.css"
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import Input, { DateInput, PhoneInput, SelectInput } from "@/components/ui/Input";
import InputGroup from "@/components/layout/InputGroup";
import { User } from "@/services/authApi";
import { Button } from "@/components/ui/Button";

export default function () {

  const { logout, user } = useAuth();

  const { current } = useRef<Omit<User, "password" | "id" | "createdAt">>({
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    birthdate: user?.birthdate ?? new Date(),
    sexe: user?.sexe ?? "M",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  return (
    <View className="flex-1 bg-gy-gray-50 pb-safe">

      <ScrollView className="flex-1">
        <View className="flex-1 pt-10 pb-5">
          <InputGroup title="Informations personnelles">
          <Input
            label="Mon nom"
            type="text"
            defaultValue={current.lastname}
            onChangeText={(text) => { current.lastname = text; }}
            placeholder="Nom"
          />
          <Input
            label="Mon prénom"
            type="text"
            defaultValue={current.firstname}
            onChangeText={(text) => { current.firstname = text; }}
            placeholder="Prénom"
          />
          <DateInput
            label="Ma date de naissance"
            value={current.birthdate}
            onChange={(date) => { current.birthdate = date; }}
          />
          <SelectInput
            label="Sexe"
            options={[
              { label: "Homme", value: "M" },
              { label: "Femme", value: "F" },
              { label: "Autre", value: "O" },
            ]}
            value={current.sexe}
            onChange={(val) => { current.sexe = val; }}
          />
        </InputGroup>

        <InputGroup title="Informations de connexion">
          <Input
            label="Mon email"
            type="email"
            defaultValue={current.email}
            onChangeText={(text) => { current.email = text; }}
            placeholder="Email"
          />
          <PhoneInput
            label="Mon téléphone"
            defaultValue={current.phone}
            onChange={(raw) => { current.phone = raw; }}
          />
        </InputGroup>
        </View>
      </ScrollView>

      <View className="px-10 py-4 border-t border-gy-gray-200">
        <Button title="Enregistrer" fullWidth disabled />
      </View>
    </View>
  );
}