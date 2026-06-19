import { View, StatusBar } from 'react-native'
import ThemedText from '@/components/ui/ThemedText'

export default function forgetPassword() {
  return (<>
    <StatusBar backgroundColor="#effbf1" barStyle="dark-content" />
    <View className='bg-gy-gray-50 flex-1 justify-center items-center'>
      <ThemedText format="heroTitle">Mot de passe oublié</ThemedText>
    </View>
  </>
  )
}
