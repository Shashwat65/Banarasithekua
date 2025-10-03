export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "traditional", label: "Traditional" },
      { id: "premium", label: "Premium" },
      { id: "gift-boxes", label: "Gift Boxes" },
      { id: "festive", label: "Festive" },
      { id: "bulk-orders", label: "Bulk Orders" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "banarasi-thekua", label: "Banarasi Thekua" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "All Products",
    path: "/shop/listing",
  },
  // Category tabs
  {
    id: "traditional",
    label: "Traditional",
    path: "/shop/listing",
  },
  {
    id: "premium",
    label: "Premium",
    path: "/shop/listing",
  },
  {
    id: "gift-boxes",
    label: "Gift Boxes",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "Our Story",
    path: "/shop/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
];

export const categoryOptionsMap = {
  traditional: "Traditional",
  premium: "Premium",
  "gift-boxes": "Gift Boxes",
  festive: "Festive",
  "bulk-orders": "Bulk Orders",
};

export const brandOptionsMap = {
  "banarasi-thekua": "Banarasi Thekua",
};

export const filterOptions = {
  category: [
    { id: "traditional", label: "Traditional" },
    { id: "premium", label: "Premium" },
    { id: "gift-boxes", label: "Gift Boxes" },
    { id: "festive", label: "Festive" },
    { id: "bulk-orders", label: "Bulk Orders" },
  ],
  brand: [
    { id: "banarasi-thekua", label: "Banarasi Thekua" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
