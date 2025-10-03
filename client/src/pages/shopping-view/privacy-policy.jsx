export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Effective Date: {new Date().getFullYear()}-01-01</p>
      <div className="space-y-4 text-sm leading-6">
        <p>
          Banarasi Thekua ("we", "our", "us") respects your privacy. This policy describes how we collect, use, and safeguard your information when you visit our website and purchase our products.
        </p>
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li>Account details (name, email)</li>
          <li>Shipping details (address, phone)</li>
          <li>Order information and preferences</li>
        </ul>
        <h2 className="text-xl font-semibold">How We Use Information</h2>
        <ul className="list-disc pl-6">
          <li>To process and deliver orders</li>
          <li>To provide customer support</li>
          <li>To improve our products and services</li>
        </ul>
        <h2 className="text-xl font-semibold">Data Security</h2>
        <p>We implement industry standard measures to protect your data.</p>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Questions? Email support@banarasithekua.com</p>
      </div>
    </div>
  );
}
