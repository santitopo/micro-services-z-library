import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import bookFill from '@iconify/icons-eva/book-fill';
import bookMarkFill from '@iconify/icons-eva/bookmark-fill';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    admin: true,
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'administrar libros',
    path: '/dashboard/books',
    admin: true,
    icon: getIcon(bookFill)
  },
  {
    title: 'catálogo de libros',
    path: '/dashboard/books',
    admin: false,
    icon: getIcon(bookFill)
  },
  {
    title: 'Reservas',
    path: '/dashboard/reserveBook',
    icon: getIcon(bookMarkFill)
  }
];

export default sidebarConfig;
