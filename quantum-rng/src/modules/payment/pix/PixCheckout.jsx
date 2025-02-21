import { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardContent, CircularProgress, TextField, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check"; // Import Check Icon


export default function PixCheckout({ product, amount }) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/backend/payment/efi/checkout?product=${product}&amount=${amount}`);
      const data = await response.json();
      setPaymentData(data.pix_data);
    } catch (error) {
      console.error("Error fetching payment data", error);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData?.pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      {/* <Typography variant="h5" gutterBottom>
        Pagamento via PIX
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Confirme seu pagamento escaneando o QR Code ou copie e cole o código PIX.
      </Typography> */}
      <Button variant="contained" color="primary" onClick={handlePayment} disabled={loading} sx={{ mt: 3 }}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Pagar com PIX"}
      </Button>
      {paymentData && (
        <Card sx={{  }}>
          <CardContent>
            <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
            {'leia com o app do banco'}
            </Typography>
            <img src={`${paymentData.qrCodeBase64}`} alt="PIX QR Code" style={{ width: "100%", borderRadius: 8 }} />
            {/* <Typography variant="body2" sx={{ mt: 2 }}>
              TXID: {paymentData.txid}
            </Typography> */}
            <TextField
              fullWidth
              variant="outlined"
              value={paymentData.pixCopiaECola}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={handleCopy}>
                      {copied ? <CheckIcon /> : <ContentCopyIcon />}
                    </IconButton>
                  ),
                },
              }}
              sx={{ mt: 2 }}
            />
            Pix Copia e Cola
            {copied && <Typography color="success.main">Copiado!</Typography>}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
