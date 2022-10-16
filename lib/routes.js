import {
  AlertCircle,
  Bold,
  Droplet,
  Gift,
  HelpCircle,
  Home,
  Image,
  Link,
  MapPin,
  MessageCircle,
  Navigation,
  PieChart,
  Sidebar,
  Terminal,
  Type,
  Underline,
  User,
  DollarSign,
} from 'react-feather';

export default [
  {
    path: '/',
    name: 'Overview',
    icon: <Home strokeWidth={1} size={16} />,
  },
  {
    name: 'Manage Products',
    icon: <Gift strokeWidth={1} size={16} />,
    children: [
      {
        path: '/products/all-products',
        name: 'All Products',
      },
      {
        path: '/products/categories',
        name: 'Product Categories',
      },
    ],
  },
  {
    name: 'Manage Purchases',
    icon: <DollarSign strokeWidth={1} size={16} />,
    children: [
      {
        path: '/purchases/all-purchase',
        name: 'All Purchases',
      },
      {
        path: '/purchases/add-purchase',
        name: 'Add Purchase',
      },
    ],
  },
  {
    path: '/suppliers',
    name: 'Manage Suppliers',
    icon: <User strokeWidth={1} size={16} />,
  },
];
