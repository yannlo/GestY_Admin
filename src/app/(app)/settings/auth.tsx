import "@/app/global.css"
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";
import ThemedText from "@/components/ui/ThemedText";
import { SettingsMenu, SettingsMenuLine, SettingsMenuLineStatus, SettingsMenuLineToggle } from "@/components/layout/menu/SettingsMenu";

export default function () {

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gy-gray-50 py-10">

      <SettingsMenu title="Générales">
        <SettingsMenuLine title="Modifier votre mot de passe" href="/settings/setPassword" />
        <SettingsMenuLineToggle title="Double authentification" isToggled={isTwoFactorEnabled} isToggleDisabled={false} onPress={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)} />
      </SettingsMenu>

      <SettingsMenu title="Services tiers">
        <SettingsMenuLineStatus title="Se connecter avec Facebook" enabled={false} />
        <SettingsMenuLineStatus title="Se connecter avec Google" enabled={true} />
        <SettingsMenuLineStatus title="Se connecter avec ICloud" enabled={false} />
      </SettingsMenu>
    </ScrollView>
  );
}

