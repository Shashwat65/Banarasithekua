import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { capturePayment, checkPaymentStatus } from "@/store/shop/order-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function PhonePeCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const merchantTransactionId = JSON.parse(sessionStorage.getItem('merchantTransactionId'));

    if (!orderId || !merchantTransactionId) {
      setPaymentStatus('error');
      toast({
        title: "Invalid payment session",
        description: "Missing payment information",
        variant: "destructive",
      });
      return;
    }

    // Check payment status
    dispatch(checkPaymentStatus(merchantTransactionId))
      .then((result) => {
        if (result.payload?.success) {
          const paymentData = result.payload.data;
          
          if (paymentData.success && paymentData.data.state === 'COMPLETED') {
            // Payment successful, capture it
            dispatch(capturePayment({ merchantTransactionId, orderId }))
              .then((captureResult) => {
                if (captureResult.payload?.success) {
                  setPaymentStatus('success');
                  setOrderDetails(captureResult.payload.data);
                  // Clean up session storage
                  sessionStorage.removeItem('currentOrderId');
                  sessionStorage.removeItem('merchantTransactionId');
                } else {
                  setPaymentStatus('error');
                  toast({
                    title: "Payment capture failed",
                    description: captureResult.payload?.message || "Failed to process payment",
                    variant: "destructive",
                  });
                }
              });
          } else {
            setPaymentStatus('failed');
            toast({
              title: "Payment Failed",
              description: "Your payment was not completed successfully",
              variant: "destructive",
            });
          }
        } else {
          setPaymentStatus('error');
          toast({
            title: "Payment verification failed",
            description: result.payload?.message || "Could not verify payment status",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        setPaymentStatus('error');
        toast({
          title: "Payment verification failed",
          description: "Could not verify payment status",
          variant: "destructive",
        });
      });
  }, [location, dispatch, toast]);

  const handleContinueShopping = () => {
    navigate('/shop/home');
  };

  const handleViewOrders = () => {
    navigate('/shop/account');
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-semibold mb-2 text-green-800">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your order has been confirmed and will be processed shortly.</p>
            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2">Order Details:</h3>
                <p><span className="font-medium">Order ID:</span> {orderDetails._id}</p>
                <p><span className="font-medium">Amount:</span> ₹{orderDetails.totalAmount}</p>
                <p><span className="font-medium">Status:</span> {orderDetails.orderStatus}</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={handleViewOrders} variant="outline">
                View My Orders
              </Button>
              <Button onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-semibold mb-2 text-red-800">Payment Failed</h2>
            <p className="text-gray-600 mb-6">Your payment could not be processed. Please try again.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/shop/checkout')} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center py-8">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-semibold mb-2 text-red-800">Something went wrong</h2>
            <p className="text-gray-600 mb-6">There was an error processing your payment. Please contact support if the issue persists.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleContinueShopping} variant="outline">
                Go to Home
              </Button>
              <Button onClick={() => navigate('/shop/account')}>
                Contact Support
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-amber-800">
            Banarasi Thekua
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

export default PhonePeCallback;