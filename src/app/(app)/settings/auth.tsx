import "@/app/global.css"
import { useState } from "react";
import { ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "@/components/layouts/Menu/Menu";
import { MenuItem, MenuItemStatus, MenuItemToggle } from "@/components/layouts/Menu/MenuItem";

export default function () {

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gy-gray-50 py-10">

      <Menu title="Générales">
        <MenuItem title="Modifier votre mot de passe" href="/settings/setPassword" />
        <MenuItemToggle title="Double authentification" isToggled={isTwoFactorEnabled} isToggleDisabled={false} onPress={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)} />
        <MenuItem title="Se déconnecter" onPress={logout} />
      </Menu>

      <Menu title="Services tiers">
        <MenuItemStatus title="Se connecter avec Facebook" enabled={false} />
        <MenuItemStatus title="Se connecter avec Google" enabled={true} />
        <MenuItemStatus title="Se connecter avec ICloud" enabled={false} />
      </Menu>
    </ScrollView>
  );
}

