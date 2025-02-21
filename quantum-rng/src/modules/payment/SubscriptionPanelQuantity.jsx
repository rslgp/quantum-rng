import React, { useState } from 'react';
import { Card, CardContent, Button, Typography, IconButton, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import PixCheckout from './pix/PixCheckout';

const pack_decisoes = 3;
const SubscriptionPanelQuantity = ({ title, price, productTag, onSelect, isQuantity = true }) => {
  const [quantity, setQuantity] = useState(1);  // Default quantity set to 1

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);  // Increase quantity
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);  // Decrease quantity, but not below 1
    }
  };

  // Calculate total price based on quantity
  const totalPrice = (price * quantity).toFixed(2);  // Format to 2 decimal places

  const totalQtdDecisoes = (pack_decisoes * quantity).toFixed(0);  // Format to 2 decimal places

  return (
    <Card style={{ maxWidth: 300, margin: '0 10px' }}>
      <CardContent>
        <Typography variant="h5" component="div" align="center">{title}</Typography>
        {/* Display total price (price * quantity) */}
        <Typography variant="h6" align="center">R$ {totalPrice}</Typography>
        <Typography variant="h6" align="center" style={{ visibility: isQuantity ? 'visible' : 'hidden', }}>{totalQtdDecisoes} Decisoes</Typography>

        {/* Quantity Selector with Increase/Decrease Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            marginTop: 20,
            visibility: isQuantity ? 'visible' : 'hidden',
          }}
        >
          <IconButton
            onClick={handleDecrease}
            disabled={quantity <= 1}
            style={{ padding: 10 }}
          >
            <Remove fontSize="large" />
          </IconButton>
          <Typography variant="h6">{quantity}</Typography>
          <IconButton
            onClick={handleIncrease}
            style={{ padding: 10 }}
          >
            <Add fontSize="large" />
          </IconButton>
        </Box>

        {/* Select Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onSelect(productTag, quantity)}  // Pass quantity and total price to stripeCheckout
          sx={{ mt: 2 }}
        >
          Select
        </Button>
        
        <PixCheckout product={productTag} amount={quantity} />
      </CardContent>
    </Card>
  );
};

export default SubscriptionPanelQuantity;