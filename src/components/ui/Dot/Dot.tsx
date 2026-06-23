import { View } from 'react-native'


export type DotProps = {
  state: 'red' | 'yellow' | 'black' | 'green'
  className?: string
}


export default function Dot({ state, className }: DotProps) {

  const colorClass = state === 'red' ? 'bg-red-500' : state === 'yellow' ? 'bg-yellow-500' : state === 'black' ? 'bg-black' : 'bg-green-500';

  return <View className={["size-3.5 rounded-full", colorClass, className].join(' ')} />
}