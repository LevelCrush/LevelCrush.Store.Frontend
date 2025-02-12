export interface MenuLinkRecord {
  title: string;
  url: string;
  id: string;
  order: string;
  loginOnly: boolean;
}

export interface MenuRecord {
  title: string;
  url: string;
  slug: string;
  links: MenuLinkRecord[];
  submenus: MenuRecord[];
  order: number;
  loginOnly: boolean;
}

export interface MenuProps {
  menu?: MenuRecord | null;
}

export function MenuLink() {
  return <></>;
}

export default function Menu(props: MenuProps) {
  if (!props.menu) {
    return <></>;
  }

  // for now this has no actual function
  return <> </>;
}
