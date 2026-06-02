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
		<footer className="relative mx-auto w-full max-w-6xl rounded-t-[2rem] border-t bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-14 sm:px-10 md:rounded-t-[3rem] lg:py-16">
			<div className="bg-foreground/20 absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			{/* Even 5-column grid: brand + 4 link columns, equal gaps both sides */}
			<div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-5 md:gap-8">
				<AnimatedContainer className="col-span-2 space-y-4 md:col-span-1">
					<div className="flex items-center gap-3">
						<img src="/images/logo.png" alt={site.brand} className="h-10 w-10 shrink-0 object-contain" />
						<span className="display text-sm leading-tight text-foreground">{site.brand}</span>
					</div>
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} {site.legalName}. All rights reserved.
					</p>
				</AnimatedContainer>

				{footerLinks.map((section, index) => (
					<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
						<h3 className="text-xs uppercase tracking-[0.2em] text-gold/70">{section.label}</h3>
						<ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
							{section.links.map((link) => (
								<li key={link.title}>
									<a
										href={link.href}
										target={link.href.startsWith('#') ? undefined : '_blank'}
										rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
										className="hover:text-foreground inline-flex items-center transition-all duration-300"
									>
										{link.icon && <link.icon className="me-1.5 h-4 w-4" />}
										{link.title}
									</a>
								</li>
							))}
						</ul>
					</AnimatedContainer>
				))}
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
