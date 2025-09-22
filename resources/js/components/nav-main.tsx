import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';

interface GroupedNav {
  title?: string;
  items: NavItem[];
}

export function NavMain({ items = [] }: { items: GroupedNav[] }) {
  const page = usePage();

  const renderMenuItems = (items: NavItem[]) =>
    items.map((item, index) => {
      const key = item.href || item.title || index;

      // If the item has children, recursively render
      if (item.items && item.items.length > 0) {
        return (
          <Fragment key={key}>
            <SidebarGroupLabel className="text-md font-semibold text-gray-700 dark:text-gray-200">
              {item.title}
            </SidebarGroupLabel>
            <SidebarMenu className="pl-4">
              {renderMenuItems(item.items)}
            </SidebarMenu>
          </Fragment>
        );
      }

      return (
        <SidebarMenuItem key={key}>
          <SidebarMenuButton
            asChild
            isActive={item.href ? page.url.startsWith(item.href) : false}
            tooltip={{ children: item.title }}
          >
            <Link
              href={item.href || '#'}
              prefetch
              className="flex items-center gap-2"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <>
      {items.map((group, idx) => {
        const isBgColorGroup =  group.title === 'User Management' ||
                                group.title === 'OSDS' ||
                                group.title === 'SGOD';

        return (
          <SidebarGroup className="px-2 py-0" key={group.title || idx}>
            {group.title && (
              <SidebarGroupLabel
                className={`text-md font-semibold px-2 py-2 ${isBgColorGroup ? 'bg-gray-500 text-white rounded' : 'text-gray-700 dark:text-gray-200'
                  }`}
              >
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="pl-3">
              {renderMenuItems(group.items)}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
