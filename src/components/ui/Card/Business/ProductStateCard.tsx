import React from 'react'
import CardLayout from '../CardLayout';
import CardBodyLayout from '../CardBodyLayout';
import CardSubtitleLine from '../CardSubtitleLine';
import ThemedText from '../../ThemedText';
import CardTitleLine from '../CardTitleLine';
import Dot, { DotProps } from '../../Dot/Dot';
import { defineDotState, defineProductDotState } from '@/utils/dot';
import { PRODUCT_STATUES, STATUSES } from '@/constants/Enum';
import CardBaseLineWithDot from '../CardBaseLineWithDot';

type ActivityInfo = {
  icon: string;
  label: string;
  state: StatusValue;
};

type Props = {
  activity: ActivityInfo;
  productStats: ProductStatBase;
};


export default function ProductStateCard({ activity, productStats }: Props) {

  return (
    <CardLayout>
      <CardTitleLine icon={activity.icon} label={activity.label} borderEnabled={activity.state !== "inactive"}>
        <ThemedText format="strong" color='black' className='text-xl'>
          {STATUSES.find(({ value }) => value == activity.state)?.label}
        </ThemedText>
        <Dot state={defineDotState(activity.state)} />
      </CardTitleLine>

      {activity.state !== "inactive" && <CardBodyLayout>
        <CardSubtitleLine label={"Produit enregistrés"}>
          <ThemedText format="strong" className='text-lg'>{productStats.total}</ThemedText>
        </CardSubtitleLine>

        {Object.entries(productStats)
          .filter(([key]) => key !== 'total')
          .map(([key, count]) => {
            const status = key as ProductStatusValue;
            const dotState = defineProductDotState(status);
            if (!dotState) return null;
            return (
              <ProductStateRow
                key={key}
                label={PRODUCT_STATUES.find(({ value }) => value === status)?.label ?? key}
                state={dotState}
                count={count}
              />
            );
          })}

      </CardBodyLayout>}
    </CardLayout>
  )
}

type ProductStateRowProps = {
  label: string
  state: DotProps["state"]
  count: number
}

const ProductStateRow = ({ label, state, count }: ProductStateRowProps) => (
  <CardBaseLineWithDot state={state} label={label}>
    <ThemedText format="strong" className='text-lg'>{count}</ThemedText>
  </CardBaseLineWithDot>

);