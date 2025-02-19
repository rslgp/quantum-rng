import React, { useState, useEffect } from 'react';
import SubscriptionPanel from './SubscriptionPanelQuantity';  // Make sure the path is correct

const SubscriptionPanels = () => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => setStripeLoaded(true);
      document.body.appendChild(script);
    } else {
      setStripeLoaded(true);
    }
  }, []);

  // The function to trigger Stripe checkout
  const stripeCheckout = async (productTag, quantityChosen) => {
    const url_stripe_checkout = `/quantum-rng/stripe-checkout.html?product=${productTag}&amount=${quantityChosen}`;
      const newWindow = window.open(url_stripe_checkout, '_blank');
      if (newWindow) {
        newWindow.opener = null;  // Prevent access to the opener
        newWindow.location.replace(url_stripe_checkout);  // Ensure referrer info isn't sent
      }      
  };

  return (
    <div>
      <h2>Select Your Plan</h2>
      {stripeLoaded ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SubscriptionPanel
            title="Mais Decisoes"
            price={3.50}
            productTag="mais_decisoes"
            onSelect={stripeCheckout}
          />
          <SubscriptionPanel
            title="Premium"
            price={18.00}
            productTag="premium"
            isQuantity={false}
            onSelect={stripeCheckout}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SubscriptionPanels;
