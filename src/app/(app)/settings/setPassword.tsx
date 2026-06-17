import "@/app/global.css"
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import Input, { DateInput, PhoneInput, SelectInput } from "@/components/ui/Input";
import InputGroup from "@/components/layout/InputGroup";
import { User } from "@/services/authApi";
import { Button } from "@/components/ui/Button";

interface SetPassword{
  current: string,
  new: string,
  confirm: string,
}

export default function () {

  const { logout, user } = useAuth();

  const { current } = useRef<SetPassword>({
    current: "",
    new: "",
    confirm: "",
  });

  return (
    <View className="flex-1 bg-gy-gray-50 pb-safe">

      <ScrollView className="flex-1">
        <View className="flex-1 pt-10 pb-5">
          <InputGroup title="Informations personnelles">
          <Input
            label="Mot de passe actuel"
            type="password"
            defaultValue={current.current}
            onChangeText={(text) => { current.current = text; }}
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            defaultValue={current.new}
            onChangeText={(text) => { current.new = text; }}
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            defaultValue={current.confirm}
            onChangeText={(text) => { current.confirm = text; }}
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