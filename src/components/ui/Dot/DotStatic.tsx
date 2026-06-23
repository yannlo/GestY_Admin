import { View } from 'react-native'


type Props = {
  className?: string
}


export default function ({className }: Props) {

  return <View className={["size-1.5 rounded-full", className].join(' ')} />
}