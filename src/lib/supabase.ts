import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'krako-auth-token',
  }
});

export interface Profile {
  id: string;
  email: string | null;
  username: string;
  krako_balance: number;
  hashrate: number;
  last_claim_at: string;
  total_invites: number;
  total_claims: number;
  daily_claim_amount: number;
  daily_claims_count: number;
  last_claim_date: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  reward: number;
  icon: string;
  action_url: string;
  task_type: string;
  is_active: boolean;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price_ton: number;
  krako_amount: number;
  discount_percent: number;
  stock: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
  reward_claimed: boolean;
}

export interface RewardUtility {
  id: string;
  name: string;
  description: string;
  kponts_required: number;
  category: string;
  icon: string;
  is_available: boolean;
  is_coming_soon: boolean;
  max_redeems: number | null;
  current_redeems: number;
  created_at: string;
  updated_at: string;
}

export interface UserRedemption {
  id: string;
  user_id: string;
  utility_id: string;
  kponts_spent: number;
  status: string;
  redeemed_at: string;
  fulfilled_at: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
}

// Initialize or get user profile
export async function getOrCreateProfile(userId: string): Promise<Profile | null> {
  // Try to get existing profile
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  // If no profile exists, create one
  if (!profile && !error) {
    const { data: { user } } = await supabase.auth.getUser();
    const today = new Date().toISOString().split('T')[0];
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user?.email || null,
        username: user?.user_metadata?.name || 'Miner',
        krako_balance: 0,
        hashrate: 3,
        total_claims: 0,
        daily_claim_amount: 0.05,
        daily_claims_count: 0,
        last_claim_date: today,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return null;
    }

    profile = newProfile;
  }

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

// Update user balance and create transaction
export async function updateBalance(
  userId: string,
  amount: number,
  transactionType: string,
  description: string
): Promise<boolean> {
  try {
    // Get current profile
    const profile = await getOrCreateProfile(userId);
    if (!profile) return false;

    const newBalance = Number(profile.krako_balance) + amount;

    // Update balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        krako_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return false;
    }

    // Create transaction record
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: transactionType,
        amount,
        description,
      });

    if (txError) {
      console.error('Error creating transaction:', txError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateBalance:', err);
    return false;
  }
}

// Handle daily claim - multiple claims per day up to 1.00 KRAKO total
export async function handleDailyClaim(userId: string): Promise<{ success: boolean; amount?: number; error?: string; remainingClaims?: number }> {
  try {
    // Get current profile
    const profile = await getOrCreateProfile(userId);
    if (!profile) return { success: false, error: 'Profile not found' };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const lastClaimDate = profile.last_claim_date?.split('T')[0];

    // Check if it's a new day - if so, reset daily claims count
    let dailyClaimsCount = profile.daily_claims_count || 0;
    if (lastClaimDate !== today) {
      dailyClaimsCount = 0;
    }

    // Check if user has reached daily limit (20 claims = 1.00 KRAKO total)
    const MAX_DAILY_CLAIMS = 20;
    if (dailyClaimsCount >= MAX_DAILY_CLAIMS) {
      return {
        success: false,
        error: 'Daily limit reached. Come back tomorrow!'
      };
    }

    // Each claim gives 0.05 KRAKO
    const claimAmount = 0.05;
    const newBalance = Number(profile.krako_balance) + claimAmount;
    const newDailyClaimsCount = dailyClaimsCount + 1;
    const newTotalClaims = profile.total_claims + 1;
    const remainingClaims = MAX_DAILY_CLAIMS - newDailyClaimsCount;

    // Update profile with new values
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        krako_balance: newBalance,
        total_claims: newTotalClaims,
        daily_claims_count: newDailyClaimsCount,
        last_claim_date: today,
        last_claim_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { success: false, error: 'Failed to update profile' };
    }

    // Create transaction record
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: 'claim',
        amount: claimAmount,
        description: `Daily Claim ${newDailyClaimsCount}/20 (+0.05 KRAKO)`,
      });

    if (txError) {
      console.error('Error creating transaction:', txError);
    }

    return {
      success: true,
      amount: claimAmount,
      remainingClaims: remainingClaims
    };
  } catch (err) {
    console.error('Error in handleDailyClaim:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
