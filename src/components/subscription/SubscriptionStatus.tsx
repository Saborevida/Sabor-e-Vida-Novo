import React, { useEffect, useState } from 'react';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { getUserSubscription } from '../../lib/stripe';
import { getProductByPriceId } from '../../stripe-config';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface SubscriptionStatusProps {
  className?: string;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ className = '' }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dark-800">Plano Gratuito</h3>
            <p className="text-sm text-neutral-600">Acesso limitado às funcionalidades</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => window.location.href = '/pricing'}>
            Fazer Upgrade
          </Button>
        </div>
      </Card>
    );
  }

  const product = getProductByPriceId(subscription.price_id);
  const isActive = subscription.subscription_status === 'active';
  const isPastDue = subscription.subscription_status === 'past_due';
  const isCanceled = subscription.subscription_status === 'canceled';

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
  };

  const getStatusColor = () => {
    if (isActive) return 'text-green-600';
    if (isPastDue) return 'text-yellow-600';
    if (isCanceled) return 'text-red-600';
    return 'text-neutral-600';
  };

  const getStatusText = () => {
    if (isActive) return 'Ativo';
    if (isPastDue) return 'Pagamento Pendente';
    if (isCanceled) return 'Cancelado';
    return subscription.subscription_status;
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-800">
              {product?.name || 'Premium'}
            </h3>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        {isPastDue && (
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      <div className="space-y-2 text-sm text-neutral-600">
        {subscription.current_period_end && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {isCanceled ? 'Válido até' : 'Próxima cobrança'}: {formatDate(subscription.current_period_end)}
            </span>
          </div>
        )}
        
        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            <span>
              {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
            </span>
          </div>
        )}
      </div>

      {isPastDue && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Seu pagamento está pendente. Atualize seu método de pagamento para continuar aproveitando os benefícios Premium.
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Atualizar Pagamento
          </Button>
        </div>
      )}

      {isCanceled && (
        <div className="mt-4">
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth
            onClick={() => window.location.href = '/pricing'}
          >
            Reativar Assinatura
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SubscriptionStatus;