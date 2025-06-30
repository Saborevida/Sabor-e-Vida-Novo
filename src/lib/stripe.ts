import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key';

export const stripePromise = loadStripe(stripePublishableKey);

export const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// CORREÇÃO: Importar getUserSubscription do supabase.ts
export const getUserSubscription = async () => {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

export const getUserOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};