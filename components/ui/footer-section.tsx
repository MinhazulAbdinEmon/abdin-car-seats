'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
// Using framer-motion (already installed) instead of a duplicate `motion` package.
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';
import { site, whatsappLink } from '@/lib/site';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Explore',
		links: [
			{ title: 'Craft', href: '#craft' },
			{ title: 'Transformations', href: '#transform' },
			{ title: 'Services', href: '#services' },
			{ title: 'Gallery', href: '#gallery' },
		],
	},
	{
		label: 'Studio',
		links: [
			{ title: 'Contact', href: '#contact' },
			{ title: 'WhatsApp', href: whatsappLink() },
			{ title: 'Location', href: site.mapLink },
			{ title: 'Call us', href: `tel:${site.phone.replace(/\s+/g, '')}` },
		],
	},
	{
		label: 'Services',
		links: [
			{ title: 'Seat Upholstery', href: '#services' },
			{ title: 'Leather Restoration', href: '#services' },
			{ title: 'Custom Stitching', href: '#services' },
			{ title: 'Roof Lining', href: '#services' },
		],
	},
	{
		label: 'Social',
		links: [
			{ title: 'Instagram', href: site.socials.instagram, icon: InstagramIcon },
			{ title: 'Facebook', href: site.socials.facebook, icon: FacebookIcon },
			{ title: 'YouTube', href: '#', icon: YoutubeIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="md:rounded-t-[3rem] relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center rounded-t-[2rem] border-t bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-12 lg:py-16">
			<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<div className="flex items-center gap-3">
						<img src="/images/logo.png" alt={site.brand} className="size-10 object-contain" />
						<span className="display text-sm text-foreground">{site.brand}</span>
					</div>
					<p className="text-muted-foreground mt-8 text-sm md:mt-0">
						© {new Date().getFullYear()} {site.legalName}. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs uppercase tracking-[0.2em] text-gold/70">{section.label}</h3>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												target={link.href.startsWith('#') ? undefined : '_blank'}
												rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
												className="hover:text-foreground inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
