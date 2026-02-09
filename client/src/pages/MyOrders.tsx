import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const res = await ordersAPI.getMyOrders(user?.id as string);
      return res.data?.data || [];
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/my-orders" } });
    }
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
      case "confirmed":
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "confirmed":
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "shipped":
      case "out-for-delivery":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading your orders...</p>
            </CardContent>
          </Card>
        ) : !orders || orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium text-secondary mb-2">No orders yet</p>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button onClick={() => navigate("/products")}>Browse Products</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.orderStatus)}
                      <div>
                        <CardTitle className="text-base">Order #{order._id?.slice(-8)}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.orderDate || order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus?.replace("-", " ") || "Pending"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {order.cartItems?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 pb-3 border-b last:border-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 object-cover rounded-md border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold text-secondary">₹{order.totalAmount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/track-order/${order._id}`)}
                      >
                        Track Order
                      </Button>
                    </div>
                  </div>

                  {order.addressInfo && (
                    <div className="pt-3 border-t space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Delivery Address</p>
                      <p className="text-sm">
                        {order.addressInfo.address}, {order.addressInfo.city}, {order.addressInfo.pincode}
                      </p>
                      {order.addressInfo.phone && (
                        <p className="text-sm text-muted-foreground">Phone: {order.addressInfo.phone}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
