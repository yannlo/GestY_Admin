import { useRef, useState } from "react";
import { View, Image, Pressable, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { Link } from "expo-router";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import Alert from "@/components/ui/Alert";



export default function LoginScreen() {
  const isKeyboardVisible = useKeyboardVisible();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-gy-primary-500 pt-safe">
        <View className="py-8 px-5 gap-8 items-center">
          <Image className="h-18 w-auto aspect-22/9" source={require("@/assets/images/logo/white-full-transparent.png")} />
          {!isKeyboardVisible && (
            <ThemedText format="heroText" color="primary100">Reprenez votre activité là où vous étiez. Ajoutez vos ventes, enregistrez vos commandes et suivez vos performances.</ThemedText>
          )}
        </View>

        <View className="bg-gy-white flex-1 pb-safe pt-10 px-4 rounded-t-2xl items-center gap-9">
          <ThemedText format="heroTitle" color="black">Connexion</ThemedText>
          <View className="self-stretch gap-8" >
            <Form />
            <SocialButtons />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function Form() {
  const { current } = useRef({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!current.email || !current.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError(false)
    const result = await login({ email: current.email, password: current.password });
    setIsLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  };

  return <View className="gap-6">

    {error && <Alert variant="danger" message={error} />}

    {/* inputs */}
    <View className="self-stretch gap-4">
      {/* Email */}
      <Input
        type="email"
        defaultValue={current.email}
        onChangeText={(text) => {
          current.email = text;
        }}
        placeholder="Email ou numéro de téléphone"
      />
      <View className="gap-2">
        <Input
          type="password"
          defaultValue={current.password}
          onChangeText={(text) => {
            current.password = text
          }}
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
