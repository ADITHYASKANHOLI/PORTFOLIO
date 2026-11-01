import React, { useRef, useImperativeHandle } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { usePress, useRefraction, haptic } from '@zakisheriff/liquid-glass';

export interface LiquidActionLinkProps {
  href?: string;
  to?: string;
  children?: React.ReactNode;
  variant?: 'glass' | 'default' | 'clear' | 'ghost' | 'tinted' | 'tinted-filled' | 'filled' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  thickness?: number;
  shimmer?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  download?: string | boolean;
}

/**
 * Apple-inspired Liquid Glass Action Link.
 * Preserves genuine HTML anchor semantics (<a /> or React Router <Link />), keyboard accessibility,
 * and routing while attaching real liquid glass optical refraction, touch swelling, and beveling.
 */
export const LiquidActionLink = React.forwardRef<HTMLAnchorElement, LiquidActionLinkProps>(
  (
    {
      href,
      to,
      children,
      variant = 'glass',
      size = 'md',
      intensity = 5,
      thickness = 1,
      shimmer = true,
      destructive = false,
      icon,
      className = '',
      style,
      target,
      rel,
      onClick,
      'aria-label': ariaLabel,
      download,
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLAnchorElement | null>(null);
    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLAnchorElement);

    const level = Math.max(1, Math.min(10, intensity));
    const height = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;

    usePress(internalRef, { disabled: false });
    useRefraction(internalRef, {
      kind: 'surface',
      strength: level / 5,
      bezel: Math.min(height * 0.36, 22) * Math.max(0.5, thickness),
    });

    const iconOnly = icon != null && (children == null || children === false);
    const red = destructive || variant === 'destructive';
    const kind = variant === 'ghost' ? 'clear' : variant === 'default' || variant === 'destructive' ? 'glass' : variant;
    const classes = [
      'lg-glass',
      'lg-button',
      `lg-button--${size}`,
      `lg-button--${kind}`,
      'font-sans tracking-wide cursor-pointer select-none no-underline',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
      haptic();
      rest && 'onPointerDown' in rest && typeof (rest as Record<string, unknown>).onPointerDown === 'function' &&
        ((rest as Record<string, (e: React.PointerEvent<HTMLAnchorElement>) => void>).onPointerDown)(event);
    };

    const content = (
      <>
        {icon != null && <span className="lg-button__icon">{icon}</span>}
        {!iconOnly && children != null && <span className="lg-button__label">{children}</span>}
      </>
    );

    // If an internal route `to` is provided without an external `href`
    if (to && !href) {
      return (
        <Link
          ref={internalRef}
          to={to}
          className={classes}
          data-liquid-glass=""
          data-icon-only={iconOnly ? '' : undefined}
          data-shimmer={shimmer ? '' : undefined}
          data-destructive={red ? '' : undefined}
          style={style}
          onClick={onClick}
          onPointerDown={handlePointerDown}
          aria-label={ariaLabel}
          {...(rest as Omit<LinkProps, 'to'>)}
        >
          {content}
        </Link>
      );
    }

    const safeRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

    return (
      <a
        ref={internalRef}
        href={href || to || '#'}
        target={target}
        rel={safeRel}
        className={classes}
        data-liquid-glass=""
        data-icon-only={iconOnly ? '' : undefined}
        data-shimmer={shimmer ? '' : undefined}
        data-destructive={red ? '' : undefined}
        style={style}
        onClick={onClick}
        onPointerDown={handlePointerDown}
        aria-label={ariaLabel}
        download={download}
        {...rest}
      >
        {content}
      </a>
    );
  }
);

LiquidActionLink.displayName = 'LiquidActionLink';
