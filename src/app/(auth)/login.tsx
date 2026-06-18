import { useState, useCallback } from "react";
import { View, Image, Pressable, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "expo-router";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import Alert from "@/components/ui/Alert";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";



export default function LoginScreen() {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="flex-1 bg-gy-primary-500 pt-safe">
        <View className="py-8 px-5 gap-8 items-center">
          <Image className="h-44 aspect-square" source={require("@/assets/images/logo/white-full-transparent.png")} />
        </View>

        <View className="bg-gy-white flex-1 pb-safe pt-10 rounded-t-2xl items-stretch">
          <KeyboardAwareScrollView
            className=" flex-1"
            contentContainerClassName="flex-1 px-4 items-center gap-9"
            keyboardShouldPersistTaps="handled"
            bottomOffset={8}
            bounces={false}
          >
            <ThemedText format="heroTitle" color="black">Connexion</ThemedText>
            <View className="self-stretch gap-8">
              <Form />
              <SocialButtons />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError(false);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  }, [email, password, login, router]);

  return <View className="gap-6">

    {error && <Alert variant="danger" message={error} />}

    {/* inputs */}
    <View className="self-stretch gap-4">
      {/* Email */}
      <Input
        type="email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email ou numéro de téléphone"
      />
      <View className="gap-2">
        <Input
          type="password"
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
        />
        <Link className="ml-4" href="/">
          <ThemedText format="link" color="gray600">Avez-vous oublié votre mot de passe?</ThemedText>
        </Link>

      </View>
    </View>

    <Button variant="primary" title="Se connecter" isLoading={isLoading} disabled={isLoading} onPress={handleLogin} />

  </View>
}

function SocialButtons() {
  return (
    <View className="items-center gap-3">
      <ThemedText format="default" color="gray700">Ou connectez-vous avec</ThemedText>
      <View className="flex-row gap-4">
        <Pressable className="border-2 border-gy-gray-800 rounded-md px-5 py-3 hover:bg-gy-gray-200 active:bg-gy-gray-200">
          <Image className="size-6" source={require("@/assets/images/icons/vendor/google.png")} />
        </Pressable>
        <Pressable className="border-2 border-gy-gray-800 rounded-md px-5 py-3 hover:bg-gy-gray-200 active:bg-gy-gray-200">
          <Image className="size-6" source={require("@/assets/images/icons/vendor/facebook.png")} />
        </Pressable>
        <Pressable className="border-2 border-gy-gray-800 rounded-md px-5 py-3 hover:bg-gy-gray-200 active:bg-gy-gray-200">
          <Image className="size-6" source={require("@/assets/images/icons/vendor/apple.png")} />
        </Pressable>
      </View>
    </View>
  );
}
