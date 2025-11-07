import api from './api';

const SCRIPT_URL = import.meta.env.VITE_PHONEPE_CHECKOUT_JS || 'https://mercury-stg.phonepe.com/web/bundle/checkout.js';

// Dynamically load PhonePe checkout script (idempotent)
export function loadPhonePeScript(src: string = SCRIPT_URL): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).PhonePeCheckout) {
      return resolve();
    }
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load PhonePe script')));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PhonePe script'));
    document.head.appendChild(script);
  });
}

export async function initiatePayment(payload: {
  items: any[];
  customer: any;
  amount: number;
}) {
  const res = await api.post('/shop/payment/phonepe/initiate', payload);
  return res.data as { success: boolean; orderId: string; merchantOrderId: string; redirectUrl: string; state: string };
}

// Open PayPage in IFRAME (recommended)
export function openPayPageIframe(tokenUrl: string, callback?: (result: 'USER_CANCEL' | 'CONCLUDED') => void) {
  const win: any = (window as any);
  if (!win.PhonePeCheckout || !win.PhonePeCheckout.transact) {
    throw new Error('PhonePeCheckout not loaded');
  }
  win.PhonePeCheckout.transact({ tokenUrl, type: 'IFRAME', callback });
}

export async function checkStatus(merchantOrderId: string) {
  const res = await api.get(`/shop/payment/phonepe/status/${merchantOrderId}`);
  return res.data as { success: boolean; data: any };
}
