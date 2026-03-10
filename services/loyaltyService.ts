
import { Customer, LoyaltyTier, PointTransactionType, LoyaltyPointTransaction } from '../types';

export const calculatePointsForSpend = (spend: number, multiplier: number) => {
  return Math.floor(spend * multiplier);
};

export const findTierForPoints = (points: number, tiers: LoyaltyTier[]) => {
  return tiers
    .sort((a, b) => b.threshold - a.threshold)
    .find(tier => points >= tier.threshold) || tiers[0];
};

export const createPointTransaction = (
  customerId: string, 
  amount: number, 
  type: PointTransactionType, 
  reference: string
): LoyaltyPointTransaction => ({
  id: Math.random().toString(36).substr(2, 9),
  customerId,
  amount,
  type,
  reference,
  date: new Date()
});

export const getTierProgress = (points: number, currentTier: LoyaltyTier, nextTier: LoyaltyTier | undefined) => {
  if (!nextTier) return 100;
  const range = nextTier.threshold - currentTier.threshold;
  const progress = points - currentTier.threshold;
  return Math.min(Math.round((progress / range) * 100), 100);
};
