import { View, ActivityIndicator } from 'react-native'

type Props = {
    isLoading: boolean
}
const LoadingScreen = ({ isLoading }: Props) => {

    if (!isLoading) return null;
    return (
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-gy-black/15 justify-center items-center">
            <ActivityIndicator size={40} className="text-gy-primary-300" />
        </View>
    )
}

export default LoadingScreen