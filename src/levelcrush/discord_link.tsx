import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import DiscordConfig from '@levelcrush/config/discord';
import { twMerge } from 'tailwind-merge';

export interface DiscordLinkProps {
  linkText?: string;
  className?: string;
}

export const DiscordLink = (
  props: React.PropsWithChildren<DiscordLinkProps>
) => (
  <Link
    /* href="https://discord.gg/levelcrush" */ href={DiscordConfig.serverInvite}
    target="_blank"
    className={twMerge(
      'block max-w-[12rem] text-center text-white bg-blue-600 hover:bg-blue-900 hover:cursor-pointer rounded px-4 py-2  mx-0 my-8 ',
      props.className
    )}
  >
    <FontAwesomeIcon className="mr-2" icon={faDiscord} />
    {props.linkText || 'Join us on Discord'}
    {props.children}
  </Link>
);

export default DiscordLink;
