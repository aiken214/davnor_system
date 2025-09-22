// AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';
import {
  BookOpen,
  Folder,
  LayoutGrid,
  UsersRound,
  Notebook,
  NotebookText,
  FileBadge,
  FileCheck,
  University,
  School,
  Building2,
  Computer,
  NotebookPen,
  Handshake,
} from 'lucide-react';

export function AppSidebar() {
  const { auth } = usePage<{ auth: { permissions: string[] } }>().props;
  const can = (permission: string) => auth.permissions.includes(permission);

  const mainNavItems = [
    {
      items: [
        can('dashboard_access') && {
          section: null,
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutGrid,
        },
      ].filter(Boolean) as { section: any; title: string; href: string; icon: any }[],
    },

    ...(can('user_management_access')
      ? [
        {
          title: 'User Management',
          items: [
            can('user_access') && {
              section: null,
              title: 'Users',
              href: '/users',
              icon: UsersRound,
            },
            can('role_access') && {
              section: null,
              title: 'Roles',
              href: '/roles',
              icon: Notebook,
            },
            can('permission_access') && {
              section: null,
              title: 'Permissions',
              href: '/permissions',
              icon: NotebookText,
            },
            can('school_access') && {
              section: null,
              title: 'Schools',
              href: '/schools',
              icon: School,
            },
            can('district_access') && {
              section: null,
              title: 'Districts',
              href: '/districts',
              icon: University,
            },
            can('division_access') && {
              section: null,
              title: 'Divisions',
              href: '/divisions',
              icon: Building2,
            },
          ].filter(Boolean) as { section: any; title: string; href: string; icon: any }[],
        },
      ]
      : []),

    {
      title: 'OSDS',
      items: [
        {
          title: 'ASDS',
          items: [
            can('opcr_access') && {
              section: null,
              title: 'OPCRs',
              href: '/opcrs',
              icon: FileBadge,
            },
          ].filter(Boolean),
        },
        {
          title: 'ICT',
          items: [
            can('dcp_access') && {
              section: null,
              title: 'DCPs',
              href: '/dcps',
              icon: Computer,
            },
            can('ict_helpdesk_access') && {
              section: null,
              title: 'ICT Helpdesk',
              href: '/tickets',
              icon: Handshake,
            },
            can('ict_action_plan_access') && {
              section: null,
              title: 'Action Plans',
              href: '#',
              icon: NotebookPen,
            },
          ].filter(Boolean),
        },
      ].filter(Boolean) as { section?: any; title: string; href?: string; icon?: any; items?: any[] }[],
    },
    {
      title: 'SGOD',
      items: [
        can('sbm_checklist_access') && {
          section: null,
          title: 'SBM Checklists',
          href: '/sbm-checklists',
          icon: FileCheck,
        },
        can('dmea_access') && {
          section: null,
          title: 'DMEA',
          href: '#',
          icon: FileCheck,
        },
      ].filter(Boolean) as { section: any; title: string; href: string; icon: any }[],
    },
  ];

  const footerNavItems = [
    {
      section: null,
      title: 'Repository',
      href: 'https://github.com/laravel/react-starter-kit',
      icon: Folder,
    },
    {
      section: null,
      title: 'Documentation',
      href: 'https://laravel.com/docs/starter-kits#react',
      icon: BookOpen,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
