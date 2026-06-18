import "@/app/global.css"
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import Input, { DateInput, SelectInput } from "@/components/ui/Input";
import InputGroup from "@/components/layouts/InputGroup";
import { Button } from "@/components/ui/Button";
import LayoutWithBottomButton from "@/components/layouts/layout/LayoutWithBottomButton";

interface SetPassword {
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

    <LayoutWithBottomButton buttons={[
      <Button title="Enregistrer" fullWidth disabled />
    ]}>
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
    </LayoutWithBottomButton>


  );
}


