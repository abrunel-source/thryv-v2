'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

/* ─── THRYV BRAND COLOURS (original) ─── */
const C = {
  green:      '#1e4d3c',   /* primary deep teal-green */
  greenMid:   '#2d6a4f',   /* mid green for accents */
  greenLight: '#52b788',   /* light green hover/highlight */
  orange:     '#e8681a',   /* CTA orange */
  orangeHover:'#f07c30',
  black:      '#111111',
  nearBlack:  '#1a1a1a',
  charcoal:   '#2c2c2c',
  midGrey:    '#6b7280',
  lightGrey:  '#e5e7eb',
  offwhite:   '#f8f9f7',   /* Revo uses near-white page bg */
  white:      '#ffffff',
  greenTint:  '#edf5f0',   /* very light green tint for section bgs */
  greenBorder:'rgba(30,77,60,0.12)',
}

/* ─── GLOBAL STYLES ─── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; font-size: 16px; }

  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: ${C.white};
    color: ${C.nearBlack};
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* ── SCROLL REVEAL ── */
  .reveal {
    opacity: 0;
    transform: translateY(44px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.visible { opacity: 1; transform: none; }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.45s; }
  .reveal-delay-5 { transition-delay: 0.6s; }

  .reveal-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal-left.visible { opacity: 1; transform: none; }

  .reveal-right {
    opacity: 0;
    transform: translateX(40px);
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal-right.visible { opacity: 1; transform: none; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 56px; height: 76px;
    transition: background 0.35s, box-shadow 0.35s;
  }
  .nav.solid {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 ${C.greenBorder};
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Fraunces', serif;
    font-size: 1.45rem; font-weight: 600; letter-spacing: -0.02em;
    color: ${C.green}; text-decoration: none;
  }
  .nav-logo-dot { color: ${C.orange}; }
  .nav-links {
    display: flex; align-items: center; gap: 40px; list-style: none;
  }
  .nav-links a {
    font-size: 0.875rem; font-weight: 500; letter-spacing: 0.01em;
    color: ${C.charcoal}; text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: ${C.green}; }
  .nav-cta {
    background: ${C.orange}; color: ${C.white} !important;
    padding: 10px 22px; border-radius: 100px;
    font-weight: 600 !important; font-size: 0.85rem !important;
    letter-spacing: 0.01em !important;
    transition: background 0.2s, transform 0.15s !important;
  }
  .nav-cta:hover { background: ${C.orangeHover} !important; transform: translateY(-1px); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    background: ${C.white};
    display: flex; flex-direction: column; justify-content: center;
    padding: 140px 56px 100px;
    position: relative; overflow: hidden;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${C.greenMid};
    margin-bottom: 36px;
    opacity: 0; animation: fadeUp 0.7s 0.2s forwards;
  }
  .hero-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: ${C.orange};
    display: inline-block;
  }
  .hero-headline {
    font-family: 'Fraunces', serif;
    font-size: clamp(3.2rem, 6.5vw, 6.5rem);
    font-weight: 300; line-height: 1.02; letter-spacing: -0.02em;
    color: ${C.black}; max-width: 900px;
    opacity: 0; animation: fadeUp 0.85s 0.35s forwards;
  }
  .hero-headline .line-green { color: ${C.green}; }
  .hero-headline .line-cycling {
    display: inline-block;
    color: ${C.orange};
    font-style: italic;
  }
  .hero-sub {
    font-size: 1.1rem; font-weight: 400; line-height: 1.7;
    color: ${C.midGrey}; max-width: 520px;
    margin-top: 32px;
    opacity: 0; animation: fadeUp 0.85s 0.5s forwards;
  }
  .hero-actions {
    display: flex; align-items: center; gap: 20px;
    margin-top: 48px;
    opacity: 0; animation: fadeUp 0.85s 0.65s forwards;
  }
  .btn-primary {
    background: ${C.orange}; color: ${C.white};
    padding: 15px 34px; border-radius: 100px;
    font-size: 0.9rem; font-weight: 600; letter-spacing: 0.01em;
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(232,104,26,0.25);
  }
  .btn-primary:hover {
    background: ${C.orangeHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(232,104,26,0.3);
  }
  .btn-outline {
    color: ${C.green}; background: transparent;
    padding: 14px 32px; border-radius: 100px;
    border: 1.5px solid ${C.greenBorder};
    font-size: 0.9rem; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-outline:hover {
    border-color: ${C.green};
    background: ${C.greenTint};
  }
  .hero-scroll-hint {
    position: absolute; bottom: 40px; left: 56px;
    display: flex; align-items: center; gap: 12px;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${C.lightGrey};
    opacity: 0; animation: fadeIn 1s 1.2s forwards;
  }
  .hero-scroll-line {
    width: 48px; height: 1px; background: ${C.lightGrey};
  }
  .hero-badge-cluster {
    position: absolute; right: 56px; bottom: 80px;
    display: flex; flex-direction: column; gap: 12px;
    opacity: 0; animation: fadeUp 1s 0.9s forwards;
  }
  .hero-badge {
    background: ${C.white};
    border: 1px solid ${C.lightGrey};
    border-radius: 12px;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    min-width: 220px;
  }
  .badge-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${C.greenTint};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .badge-icon svg { width: 18px; height: 18px; color: ${C.green}; }
  .badge-text-label { font-size: 0.7rem; color: ${C.midGrey}; }
  .badge-text-value { font-size: 0.9rem; font-weight: 600; color: ${C.nearBlack}; }

  /* ── SECTION COMMONS ── */
  .section { padding: 120px 56px; }
  .section-inner { max-width: 1160px; margin: 0 auto; }
  .eyebrow {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${C.greenMid};
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .eyebrow::before {
    content: '';
    width: 24px; height: 2px;
    background: ${C.orange};
    display: inline-block; flex-shrink: 0;
  }
  .display-heading {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.2rem, 4vw, 3.8rem);
    font-weight: 300; line-height: 1.1; letter-spacing: -0.02em;
    color: ${C.black};
  }
  .display-heading em { font-style: italic; color: ${C.green}; }
  .display-heading .accent { color: ${C.orange}; }

  /* ── INTRO / ABOUT ── */
  .intro-bg { background: ${C.offwhite}; }
  .intro-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 96px; align-items: center;
  }
  .intro-body {
    font-size: 1.05rem; line-height: 1.8; color: #4b5563;
    margin-top: 24px; margin-bottom: 36px;
  }
  .stats-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px; border-radius: 16px; overflow: hidden;
    box-shadow: 0 0 0 1px ${C.greenBorder};
  }
  .stat-cell {
    background: ${C.white}; padding: 36px 32px;
    transition: background 0.2s;
  }
  .stat-cell:hover { background: ${C.greenTint}; }
  .stat-num {
    font-family: 'Fraunces', serif;
    font-size: 2.8rem; font-weight: 400; line-height: 1;
    color: ${C.green}; margin-bottom: 8px;
  }
  .stat-label {
    font-size: 0.8rem; font-weight: 500; letter-spacing: 0.04em;
    color: ${C.midGrey};
  }
  .counter-val { display: inline-block; }

  /* ── SERVICES TABS (Revo ecosystem-style) ── */
  .services-bg { background: ${C.white}; }
  .services-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 56px; gap: 40px;
  }
  .services-tabs {
    display: flex; gap: 0; flex-wrap: nowrap;
    border-bottom: 1px solid ${C.lightGrey};
    margin-bottom: 64px; overflow-x: auto;
    scrollbar-width: none;
  }
  .services-tabs::-webkit-scrollbar { display: none; }
  .tab-btn {
    padding: 14px 28px; font-size: 0.875rem; font-weight: 500;
    color: ${C.midGrey}; background: none; border: none; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: color 0.2s, border-color 0.2s; white-space: nowrap;
    display: flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
  }
  .tab-btn.active { color: ${C.green}; border-bottom-color: ${C.orange}; }
  .tab-btn:hover:not(.active) { color: ${C.nearBlack}; }
  .tab-num {
    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em;
    color: ${C.orange}; opacity: 0.6;
  }
  .tab-num.active-num { opacity: 1; }
  .service-panel {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
    min-height: 360px;
  }
  .service-panel-content {}
  .service-panel-title {
    font-family: 'Fraunces', serif;
    font-size: 2.2rem; font-weight: 300; line-height: 1.15;
    letter-spacing: -0.02em; color: ${C.black};
    margin-bottom: 20px;
  }
  .service-panel-desc {
    font-size: 1rem; line-height: 1.75; color: #4b5563;
    margin-bottom: 32px;
  }
  .service-features { list-style: none; }
  .service-features li {
    font-size: 0.875rem; color: #374151; padding: 9px 0;
    border-bottom: 1px solid ${C.lightGrey};
    display: flex; align-items: center; gap: 10px;
  }
  .service-features li::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: ${C.orange}; flex-shrink: 0;
  }
  .service-panel-visual {
    background: ${C.greenTint};
    border-radius: 20px; padding: 48px;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 320px; position: relative; overflow: hidden;
  }
  .service-panel-visual::before {
    content: ''; position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(30,77,60,0.08);
  }
  .service-visual-icon {
    width: 56px; height: 56px;
    background: ${C.white}; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .service-visual-icon svg { width: 28px; height: 28px; color: ${C.green}; }
  .service-visual-label {
    font-family: 'Fraunces', serif;
    font-size: 1.5rem; font-weight: 300; color: ${C.green};
    letter-spacing: -0.01em; line-height: 1.3;
  }

  /* ── PRICING ── */
  .pricing-bg { background: ${C.offwhite}; }
  .pricing-header { text-align: center; margin-bottom: 64px; }
  .pricing-sub {
    font-size: 1rem; color: ${C.midGrey}; margin-top: 16px;
    max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.7;
  }
  .pricing-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .price-card {
    background: ${C.white}; border-radius: 20px;
    padding: 36px 28px; border: 1.5px solid ${C.lightGrey};
    position: relative; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  }
  .price-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.09);
    border-color: ${C.greenBorder};
  }
  .price-card.featured {
    border-color: ${C.green}; background: ${C.green};
  }
  .featured-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: ${C.orange}; color: ${C.white};
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 4px 14px; border-radius: 100px;
    white-space: nowrap;
  }
  .price-tier {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.greenMid}; margin-bottom: 10px;
  }
  .price-card.featured .price-tier { color: rgba(255,255,255,0.6); }
  .price-desc {
    font-size: 0.82rem; color: ${C.midGrey}; line-height: 1.5;
    margin-bottom: 28px; min-height: 44px;
  }
  .price-card.featured .price-desc { color: rgba(255,255,255,0.5); }
  .price-amount {
    font-family: 'Fraunces', serif;
    font-size: 2.6rem; font-weight: 400; color: ${C.black};
    line-height: 1; margin-bottom: 4px;
  }
  .price-card.featured .price-amount { color: ${C.white}; }
  .price-period { font-size: 0.8rem; color: ${C.midGrey}; margin-bottom: 28px; }
  .price-card.featured .price-period { color: rgba(255,255,255,0.45); }
  .price-poa { font-family: 'Fraunces', serif; font-size: 2rem; color: ${C.greenMid}; }
  .price-divider { height: 1px; background: ${C.lightGrey}; margin: 0 0 24px; }
  .price-card.featured .price-divider { background: rgba(255,255,255,0.12); }
  .price-features { list-style: none; }
  .price-features li {
    font-size: 0.8rem; color: #374151; padding: 7px 0;
    display: flex; align-items: flex-start; gap: 8px; line-height: 1.45;
  }
  .price-card.featured .price-features li { color: rgba(255,255,255,0.75); }
  .price-check {
    width: 16px; height: 16px; border-radius: 50%;
    background: ${C.greenTint}; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
  }
  .price-card.featured .price-check { background: rgba(255,255,255,0.15); }
  .price-check svg { width: 9px; height: 9px; color: ${C.green}; }
  .price-card.featured .price-check svg { color: ${C.white}; }
  .price-cta-btn {
    display: block; width: 100%; text-align: center;
    margin-top: 28px; padding: 13px 20px; border-radius: 100px;
    font-size: 0.85rem; font-weight: 600; text-decoration: none;
    border: 1.5px solid ${C.lightGrey}; color: ${C.green};
    transition: all 0.2s; background: transparent;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .price-cta-btn:hover {
    border-color: ${C.orange}; background: ${C.orange}; color: ${C.white};
  }
  .price-card.featured .price-cta-btn {
    background: ${C.orange}; border-color: ${C.orange}; color: ${C.white};
  }
  .price-card.featured .price-cta-btn:hover {
    background: ${C.orangeHover}; border-color: ${C.orangeHover};
  }

  /* ── PROCESS ── */
  .process-bg { background: ${C.white}; }
  .process-header { margin-bottom: 72px; }
  .process-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  .process-step {
    padding: 52px 48px 52px 0;
    border-right: 1px solid ${C.lightGrey};
  }
  .process-step:last-child { border-right: none; padding-left: 48px; padding-right: 0; }
  .process-step:nth-child(2) { padding-left: 48px; }
  .step-number {
    font-family: 'Fraunces', serif;
    font-size: 4rem; font-weight: 300; color: ${C.lightGrey};
    line-height: 1; margin-bottom: 28px;
  }
  .step-title {
    font-family: 'Fraunces', serif;
    font-size: 1.25rem; font-weight: 400; color: ${C.black};
    margin-bottom: 12px;
  }
  .step-desc { font-size: 0.9rem; line-height: 1.75; color: #6b7280; }

  /* ── WHY THRYV ── */
  .why-bg { background: ${C.green}; }
  .why-grid {
    display: grid; grid-template-columns: 1fr 1.1fr;
    gap: 96px; align-items: center;
  }
  .why-grid .display-heading { color: ${C.white}; }
  .why-grid .display-heading em { color: ${C.greenLight}; }
  .why-grid p { color: rgba(255,255,255,0.6); font-size: 1rem; line-height: 1.75; margin-top: 20px; margin-bottom: 40px; }
  .why-grid .eyebrow { color: ${C.greenLight}; }
  .why-grid .eyebrow::before { background: ${C.orange}; }
  .why-list {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  }
  .why-item {
    background: rgba(255,255,255,0.06);
    padding: 22px 24px; border-radius: 0;
    border-left: 2px solid rgba(255,255,255,0.08);
    transition: background 0.2s, border-color 0.2s;
  }
  .why-item:hover {
    background: rgba(255,255,255,0.1);
    border-left-color: ${C.orange};
  }
  .why-item-text {
    font-size: 0.85rem; font-weight: 400; color: rgba(255,255,255,0.75);
    line-height: 1.5;
  }

  /* ── TESTIMONIALS ── */
  .testimonials-bg { background: ${C.offwhite}; }
  .testimonials-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 56px;
  }
  .google-badge {
    display: flex; align-items: center; gap: 14px;
    background: ${C.white}; padding: 16px 24px; border-radius: 14px;
    border: 1px solid ${C.lightGrey};
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  }
  .google-stars { font-size: 1rem; color: #f59e0b; letter-spacing: 2px; }
  .google-label { font-size: 0.8rem; color: ${C.midGrey}; font-weight: 500; }
  .google-score { font-family: 'Fraunces', serif; font-size: 1.5rem; color: ${C.black}; font-weight: 400; }
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  .testimonial-card {
    background: ${C.white}; border-radius: 20px; padding: 36px;
    border: 1px solid ${C.lightGrey};
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.07);
  }
  .t-quote { font-size: 2rem; color: ${C.greenLight}; line-height: 1; margin-bottom: 16px; font-family: 'Fraunces', serif; }
  .t-text { font-size: 0.9rem; line-height: 1.75; color: #374151; margin-bottom: 28px; }
  .t-author { font-size: 0.85rem; font-weight: 600; color: ${C.nearBlack}; }
  .t-time { font-size: 0.75rem; color: ${C.midGrey}; margin-top: 4px; }

  /* ── AFFILIATIONS ── */
  .affiliations-bg { background: ${C.white}; padding: 80px 56px; border-top: 1px solid ${C.lightGrey}; }
  .affiliations-inner { max-width: 1160px; margin: 0 auto; }
  .affiliations-label {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${C.midGrey}; margin-bottom: 36px;
  }
  .affiliations-row {
    display: flex; align-items: center; gap: 48px; flex-wrap: wrap;
  }
  .affil-tag {
    font-size: 0.95rem; font-weight: 600; color: #9ca3af;
    letter-spacing: 0.04em;
    transition: color 0.2s;
  }
  .affil-tag:hover { color: ${C.green}; }

  /* ── CTA SECTION ── */
  .cta-bg {
    background: ${C.offwhite}; text-align: center;
    padding: 120px 56px;
    position: relative; overflow: hidden;
  }
  .cta-bg::before {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, ${C.greenTint} 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-inner { position: relative; z-index: 1; }
  .cta-headline {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.2rem, 4vw, 3.8rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.02em; color: ${C.black};
    margin-bottom: 20px;
  }
  .cta-sub { font-size: 1rem; color: ${C.midGrey}; max-width: 440px; margin: 0 auto 48px; line-height: 1.7; }
  .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  /* ── FOOTER ── */
  .footer {
    background: ${C.nearBlack}; color: rgba(255,255,255,0.6);
    padding: 80px 56px 40px;
  }
  .footer-inner {
    max-width: 1160px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 64px; padding-bottom: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 32px;
  }
  .footer-logo {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem; font-weight: 600; color: ${C.white};
    letter-spacing: -0.02em; margin-bottom: 16px;
  }
  .footer-logo-dot { color: ${C.orange}; }
  .footer-bio {
    font-size: 0.85rem; line-height: 1.7;
    color: rgba(255,255,255,0.35); margin-bottom: 24px;
  }
  .footer-contact { font-size: 0.85rem; margin-bottom: 6px; }
  .footer-contact a { color: ${C.greenLight}; text-decoration: none; }
  .footer-col-head {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    margin-bottom: 20px;
  }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 10px; }
  .footer-links a {
    font-size: 0.85rem; color: rgba(255,255,255,0.4);
    text-decoration: none; transition: color 0.2s;
  }
  .footer-links a:hover { color: ${C.greenLight}; }
  .footer-bottom {
    max-width: 1160px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.2); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes cycleOut {
    0%   { opacity:1; transform: translateY(0); }
    100% { opacity:0; transform: translateY(-20px); }
  }
  @keyframes cycleIn {
    0%   { opacity:0; transform: translateY(20px); }
    100% { opacity:1; transform: translateY(0); }
  }
  .cycling-out { animation: cycleOut 0.35s ease forwards; }
  .cycling-in  { animation: cycleIn  0.45s ease forwards; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .nav { padding: 0 32px; }
    .hero { padding: 140px 32px 100px; }
    .section { padding: 96px 32px; }
    .hero-badge-cluster { display: none; }
    .pricing-grid { grid-template-columns: 1fr 1fr; }
    .intro-grid { grid-template-columns: 1fr; gap: 56px; }
    .service-panel { grid-template-columns: 1fr; }
    .service-panel-visual { min-height: 200px; }
    .why-grid { grid-template-columns: 1fr; gap: 56px; }
    .footer-inner { grid-template-columns: 1fr 1fr; gap: 40px; }
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .pricing-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .process-steps { grid-template-columns: 1fr; }
    .process-step { padding: 40px 0; border-right: none; border-bottom: 1px solid ${C.lightGrey}; }
    .process-step:last-child { border-bottom: none; }
    .process-step:nth-child(2) { padding-left: 0; }
    .testimonials-header { flex-direction: column; align-items: flex-start; gap: 24px; }
    .affiliations-bg { padding: 60px 32px; }
    .cta-bg { padding: 100px 32px; }
    .footer { padding: 60px 32px 32px; }
    .footer-inner { grid-template-columns: 1fr; gap: 36px; }
    .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
    .hero-scroll-hint { display: none; }
    .services-header { flex-direction: column; align-items: flex-start; }
    .why-list { grid-template-columns: 1fr; }
  }
`

/* ─── ICON COMPONENTS ─── */
const Icon = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  ),
  tax: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
    </svg>
  ),
  payroll: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
  statements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  ),
  advisory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
    </svg>
  ),
  secretary: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,6 5,9 10,3"/>
    </svg>
  ),
}

/* ─── DATA ─── */
const SERVICES = [
  {
    id: 'bookkeeping',
    label: 'Bookkeeping',
    icon: Icon.book,
    title: 'Accurate books.\nZero stress.',
    desc: 'Real-time financial records maintained with obsessive precision. Bank reconciliations, accounts payable and receivable — handled entirely so you always know exactly where your business stands.',
    features: ['Monthly bank reconciliations', 'Accounts payable & receivable', 'Xero cloud accounting', 'Monthly management accounts', 'Real-time financial visibility'],
    visual: 'Your Books,\nAlways Current.',
  },
  {
    id: 'tax',
    label: 'Tax & SARS',
    icon: Icon.tax,
    title: 'Full SARS compliance.\nNo surprises.',
    desc: 'Income tax, provisional tax, VAT submissions — planned proactively, filed on time, every time. We stay ahead of SARS so you never face penalties, interest or last-minute panic.',
    features: ['Income & provisional tax', 'VAT returns to SARS', 'Tax planning & optimisation', 'SARS correspondence handled', 'Registered tax practitioners'],
    visual: 'SARS Compliance,\nSorted.',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: Icon.payroll,
    title: 'Your team paid.\nOn time, every time.',
    desc: 'From wage calculations and deductions to payslips and SARS submissions — we manage your entire payroll cycle so your people are paid accurately and your business stays compliant.',
    features: ['Payroll calculation & payslips', 'PAYE & UIF submissions', 'Department of Labour filings', 'Leave management', 'IRP5 certificates'],
    visual: 'Payroll,\nDone Right.',
  },
  {
    id: 'statements',
    label: 'Financial Statements',
    icon: Icon.statements,
    title: 'Statements that\ntell your story.',
    desc: 'Annual financial statements prepared to IFRS standards, ready for investors, banks, or SARS. We don\'t just produce numbers — we explain what they mean for your business.',
    features: ['Annual financial statements', 'Balance sheets & income statements', 'Cash flow statements', 'IFRS compliant preparation', 'Audit & independent reviews'],
    visual: 'Statements\nInvestors Trust.',
  },
  {
    id: 'advisory',
    label: 'Financial Advisory',
    icon: Icon.advisory,
    title: 'Strategy backed\nby real numbers.',
    desc: 'Budgets, forecasts, cash flow projections and strategic financial counsel. We are your CFO-on-retainer — helping you make decisions with confidence and grow profitably.',
    features: ['Financial forecasting', 'Budget planning & control', 'Cash flow management', 'Profitability analysis', 'Growth strategy advisory'],
    visual: 'Advisory\nThat Drives Growth.',
  },
  {
    id: 'secretarial',
    label: 'Company Secretary',
    icon: Icon.secretary,
    title: 'Compliance handled.\nFocus forward.',
    desc: 'CIPC annual returns, statutory registers and company secretarial obligations managed so your company stays compliant and in good standing — without you lifting a finger.',
    features: ['CIPC annual returns', 'Statutory registers', 'Director & member changes', 'Company registration', 'Beneficial ownership filings'],
    visual: 'Secretarial,\nSeamlessly Managed.',
  },
]

const PACKAGES = [
  {
    tier: 'Bronze',
    desc: 'Growing SMBs getting their finances in order',
    price: 'R3,500',
    period: '/month',
    features: ['Monthly bookkeeping', 'Income & provisional tax', 'VAT submissions', 'Cloud accounting (Xero)', 'Payroll up to 5 employees', 'Annual financial statements', 'CIPC annual return', 'Quarterly management meetings'],
  },
  {
    tier: 'Silver',
    desc: 'Businesses needing extended payroll & compliance',
    price: 'R5,500',
    period: '/month',
    featured: true,
    features: ['Everything in Bronze', 'Extended payroll management', 'Dept of Labour submissions', 'Monthly management accounts', 'Dedicated account manager', 'Priority response SLA'],
  },
  {
    tier: 'Gold',
    desc: 'Larger businesses wanting the complete solution',
    price: 'R7,500',
    period: '/month',
    features: ['Everything in Silver', 'Full financial advisory', 'Cash flow management', 'Audit & independent review', 'Strategic financial planning', 'CFO-level insights'],
  },
  {
    tier: 'Enterprise',
    desc: 'Complex or multi-entity businesses with unique needs',
    poa: true,
    features: ['Everything in Gold', 'Multi-entity management', 'Custom financial reporting', 'On-site team visits', 'Dedicated senior CA', 'Bespoke SLA terms'],
  },
]

const TESTIMONIALS = [
  {
    text: 'From start to finish my experience with Thryv has been exceptional. Their team possesses an impressive depth of knowledge — whether it\'s tax planning, bookkeeping or financial statements, they consistently exceeded my expectations. What I appreciate most is their unwavering commitment to timely, accurate results.',
    author: 'Arnaud Brunel',
    time: '3 years ago',
  },
  {
    text: 'More than 5 stars! Thryv is a breath of fresh air. Their professionalism, expertise and quick-response is what makes their service stand out above every other firm I\'ve used. The best accounting firm in Cape Town — without question.',
    author: 'Adele Lokker',
    time: '3 years ago',
  },
  {
    text: 'Friendly, efficient and reliable — I would give 10 stars if I could. The team at Thryv made an incredibly complex process feel completely effortless. From initial onboarding everything was clearly explained. Professional in every way.',
    author: 'Tahn Hendricks',
    time: '3 years ago',
  },
]

const CYCLING_WORDS = ['Bookkeeping.', 'Tax.', 'Payroll.', 'Advisory.', 'Compliance.', 'Peace of mind.']

/* ─── HOOKS ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useCounter(target, duration = 1600, startWhenVisible = true) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(ease * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return [value, ref]
}

/* ─── MAIN COMPONENT ─── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [cycleIdx, setCycleIdx] = useState(0)
  const [cycling, setCycling] = useState(null) // 'out' | 'in' | null

  // scroll nav
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // reveal on scroll
  useReveal()

  // cycling headline word
  useEffect(() => {
    const interval = setInterval(() => {
      setCycling('out')
      setTimeout(() => {
        setCycleIdx(i => (i + 1) % CYCLING_WORDS.length)
        setCycling('in')
        setTimeout(() => setCycling(null), 450)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // counters
  const [stat1, ref1] = useCounter(5)
  const [stat2, ref2] = useCounter(100)
  const [stat3, ref3] = useCounter(3500)

  return (
    <>
      <style>{G}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? ' solid' : ''}`}>
        <a href="#" className="nav-logo">
          Thryv<span className="nav-logo-dot">.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#testimonials">Reviews</a></li>
          <li>
            <a href="https://calendly.com/thryv-admin/" target="_blank" rel="noopener" className="nav-cta">
              Book a Free Call
            </a>
          </li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Cape Town · SAIPA &amp; SAICA Accredited · SARS Registered
        </div>

        <h1 className="hero-headline">
          Expert accounting<br />
          <span className="line-green">for small businesses.</span><br />
          <span className="line-cycling cycling-{cycling}" style={{
            display: 'inline-block',
            color: C.orange,
            fontStyle: 'italic',
            animation: cycling === 'out'
              ? 'cycleOut 0.35s ease forwards'
              : cycling === 'in'
              ? 'cycleIn 0.45s ease forwards'
              : 'none',
          }}>
            {CYCLING_WORDS[cycleIdx]}
          </span>
        </h1>

        <p className="hero-sub">
          Fixed monthly fees. SAIPA &amp; SAICA accredited accountants. 
          No surprises, no jargon — just the financial clarity your business needs to grow.
        </p>

        <div className="hero-actions">
          <a href="https://calendly.com/thryv-admin/" target="_blank" rel="noopener" className="btn-primary">
            Schedule a free call
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#pricing" className="btn-outline">View packages</a>
        </div>

        <div className="hero-scroll-hint">
          <span className="hero-scroll-line" />
          Scroll to explore
        </div>

        {/* floating badges — Revo's cluster pattern */}
        <div className="hero-badge-cluster">
          <div className="hero-badge">
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <div>
              <div className="badge-text-label">Accreditation</div>
              <div className="badge-text-value">SAIPA · SAICA</div>
            </div>
          </div>
          <div className="hero-badge">
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </div>
            <div>
              <div className="badge-text-label">Google Rating</div>
              <div className="badge-text-value">5.0 ★ ★ ★ ★ ★</div>
            </div>
          </div>
          <div className="hero-badge">
            <div className="badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div className="badge-text-label">Starting from</div>
              <div className="badge-text-value">R3,500 / month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO / ABOUT ── */}
      <section className="section intro-bg">
        <div className="section-inner intro-grid">
          <div className="reveal-left">
            <div className="eyebrow">About Thryv</div>
            <h2 className="display-heading">
              Peace of mind,<br /><em>built in.</em>
            </h2>
            <p className="intro-body">
              Running a South African small business means navigating SARS compliance, CIPC obligations, payroll deadlines and strategic financial decisions — all while actually running your business. Thryv was built to take that entire load off your shoulders. Our dedicated team of accredited accountants treats your numbers like their own.
            </p>
            <a href="https://calendly.com/thryv-admin/" target="_blank" rel="noopener" className="btn-primary">
              Book a consultation
            </a>
          </div>

          <div className="reveal-right" style={{ transitionDelay: '0.15s' }}>
            <div className="stats-grid">
              <div className="stat-cell" ref={ref1}>
                <div className="stat-num counter-val">{stat1 === 5 ? '5.0' : stat1.toFixed(1)}<span style={{fontSize:'1.2rem', color: C.midGrey}}>★</span></div>
                <div className="stat-label">Google Rating</div>
              </div>
              <div className="stat-cell">
                <div className="stat-num" ref={ref2}>{stat2}%</div>
                <div className="stat-label">Client retention rate</div>
              </div>
              <div className="stat-cell" ref={ref3}>
                <div className="stat-num">R{stat3 >= 3500 ? '3,500' : stat3.toLocaleString()}</div>
                <div className="stat-label">Starting monthly fee</div>
              </div>
              <div className="stat-cell">
                <div className="stat-num">2<span style={{fontSize:'1.5rem', fontFamily:'DM Sans'}}>x</span></div>
                <div className="stat-label">Offices — CT & Stellenbosch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES (Revo ecosystem-tab style) ── */}
      <section className="section services-bg" id="services">
        <div className="section-inner">
          <div className="services-header reveal">
            <div>
              <div className="eyebrow">What We Do</div>
              <h2 className="display-heading">
                Every service your<br /><em>business needs.</em>
              </h2>
            </div>
            <a href="#pricing" className="btn-outline reveal reveal-delay-2">View packages →</a>
          </div>

          {/* Tab nav — Revo's horizontal switcher */}
          <div className="services-tabs reveal reveal-delay-1">
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                className={`tab-btn${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span className={`tab-num${activeTab === i ? ' active-num' : ''}`}>
                  0{i + 1}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Service panel */}
          <div className="service-panel">
            <div className="service-panel-content">
              <h3 className="service-panel-title" style={{ whiteSpace: 'pre-line' }}>
                {SERVICES[activeTab].title}
              </h3>
              <p className="service-panel-desc">{SERVICES[activeTab].desc}</p>
              <ul className="service-features">
                {SERVICES[activeTab].features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                href="https://calendly.com/thryv-admin/"
                target="_blank" rel="noopener"
                className="btn-primary"
                style={{ marginTop: 32, display: 'inline-flex' }}
              >
                Get started with {SERVICES[activeTab].label.toLowerCase()}
              </a>
            </div>

            <div className="service-panel-visual">
              <div className="service-visual-icon">
                {SERVICES[activeTab].icon}
              </div>
              <div className="service-visual-label" style={{ whiteSpace: 'pre-line' }}>
                {SERVICES[activeTab].visual}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section pricing-bg" id="pricing">
        <div className="section-inner">
          <div className="pricing-header reveal">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Transparent Pricing</div>
            <h2 className="display-heading">
              Fixed fees.<br /><em>No surprises.</em>
            </h2>
            <p className="pricing-sub">
              Every plan includes a dedicated team, monthly management accounts and full SARS compliance. Choose the package that fits where your business is today.
            </p>
          </div>

          <div className="pricing-grid">
            {PACKAGES.map((p, i) => (
              <div
                key={p.tier}
                className={`price-card reveal reveal-delay-${i + 1}${p.featured ? ' featured' : ''}`}
              >
                {p.featured && <div className="featured-badge">Most Popular</div>}
                <div className="price-tier">{p.tier}</div>
                <div className="price-desc">{p.desc}</div>
                {p.poa
                  ? <div className="price-poa">POA</div>
                  : <>
                      <div className="price-amount">{p.price}</div>
                      <div className="price-period">{p.period}</div>
                    </>
                }
                <div className="price-divider" />
                <ul className="price-features">
                  {p.features.map(f => (
                    <li key={f}>
                      <span className="price-check">{Icon.check}</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.poa ? 'https://thryv.co.za/request-for-quote/' : 'https://calendly.com/thryv-admin/'}
                  target="_blank" rel="noopener"
                  className="price-cta-btn"
                >
                  {p.poa ? 'Request a quote' : 'Get started'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section process-bg" id="process">
        <div className="section-inner">
          <div className="process-header reveal">
            <div className="eyebrow">How It Works</div>
            <h2 className="display-heading">
              Three steps to<br /><em>financial clarity.</em>
            </h2>
          </div>
          <div className="process-steps">
            {[
              {
                n: '01',
                title: 'Meet & Discuss',
                desc: 'Schedule a free call with a Thryv representative. We listen carefully to your business — your needs, your challenges, your goals. No obligation, no jargon.',
              },
              {
                n: '02',
                title: 'Receive Your Proposal',
                desc: 'We send a clear, tailored proposal for your review. Sign digitally when you\'re ready. No pressure, no rush — we move at your pace.',
              },
              {
                n: '03',
                title: 'We Take Over',
                desc: 'Your dedicated Thryv team seamlessly integrates with your business and takes full ownership of your accounting. From day one, the load lifts.',
              },
            ].map((s, i) => (
              <div key={s.n} className={`process-step reveal reveal-delay-${i + 1}`}>
                <div className="step-number">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THRYV ── */}
      <section className="section why-bg">
        <div className="section-inner why-grid">
          <div className="reveal-left">
            <div className="eyebrow">Why Thryv</div>
            <h2 className="display-heading">
              Your business.<br /><em>Our expertise.</em>
            </h2>
            <p>
              We are not a call-centre. Every Thryv client gets a dedicated team who understands your business intimately, communicates proactively and is always reachable — not just when something goes wrong.
            </p>
            <a href="https://calendly.com/thryv-admin/" target="_blank" rel="noopener" className="btn-primary">
              Start the conversation
            </a>
          </div>

          <div className="why-list reveal-right">
            {[
              'Fixed monthly fees — no billing surprises',
              'Free monthly consultation included',
              'SAIPA & SAICA accredited accountants',
              'Registered SARS tax practitioners',
              'Monthly management accounts for every client',
              'Cloud-powered — Xero & Karbon',
              'Leading accounting provider in South Africa',
              'Dedicated team at a fraction of in-house cost',
            ].map(item => (
              <div key={item} className="why-item">
                <span className="why-item-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-bg" id="testimonials">
        <div className="section-inner">
          <div className="testimonials-header reveal">
            <div>
              <div className="eyebrow">Client Reviews</div>
              <h2 className="display-heading">
                What our clients <em>say.</em>
              </h2>
            </div>
            <div className="google-badge">
              <div>
                <div className="google-score">5.0</div>
                <div className="google-stars">★★★★★</div>
                <div className="google-label">Google Reviews</div>
              </div>
            </div>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.author} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <div className="t-quote">"</div>
                <p className="t-text">{t.text}</p>
                <div className="t-author">{t.author}</div>
                <div className="t-time">{t.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AFFILIATIONS ── */}
      <div className="affiliations-bg">
        <div className="affiliations-inner reveal">
          <div className="affiliations-label">Technology partners &amp; professional affiliations</div>
          <div className="affiliations-row">
            {['Xero', 'Karbon', 'SAIPA', 'SAICA', 'Syft Analytics', 'Practice Ignition', 'SARS Tax Practitioners'].map(a => (
              <span key={a} className="affil-tag">{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-bg" id="contact">
        <div className="cta-inner reveal">
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 24 }}>Get Started Today</div>
          <h2 className="cta-headline">
            Ready to simplify<br /><span style={{ color: C.green, fontStyle: 'italic' }}>your finances?</span>
          </h2>
          <p className="cta-sub">
            Schedule a free consultation. Our teams in Cape Town and Stellenbosch are ready to take the accounting burden off your hands — permanently.
          </p>
          <div className="cta-actions">
            <a href="https://calendly.com/thryv-admin/" target="_blank" rel="noopener" className="btn-primary">
              Schedule a free call
            </a>
            <a href="tel:+27731421010" className="btn-outline">
              +27 73 142 1010
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Thryv<span className="footer-logo-dot">.</span></div>
            <p className="footer-bio">
              Thryv is an accounting firm based in Cape Town, South Africa. We work with our clients by taking away all their accounting load and offering expert insight to help them make better financial decisions.
            </p>
            <div className="footer-contact">
              <a href="tel:+27731421010">+27 (73) 142 1010</a>
            </div>
            <div className="footer-contact" style={{ marginTop: 4, fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
              V&amp;A Waterfront, Cape Town · Stellenbosch
            </div>
          </div>
          <div>
            <div className="footer-col-head">Services</div>
            <ul className="footer-links">
              {['Bookkeeping', 'Tax Services', 'Payroll', 'Financial Statements', 'Audit Services', 'Company Secretary', 'Financial Advisory'].map(s => (
                <li key={s}><a href="https://thryv.co.za/accounting-services/">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-head">Company</div>
            <ul className="footer-links">
              <li><a href="https://thryv.co.za/about/">About</a></li>
              <li><a href="https://thryv.co.za/news/">News</a></li>
              <li><a href="https://thryv.co.za/contact/">Contact</a></li>
              <li><a href="https://thryv.co.za/privacy-policy/">Privacy Policy</a></li>
              <li><a href="https://thryv.co.za/terms-of-use/">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-head">Areas Served</div>
            <ul className="footer-links">
              {['Cape Town', 'Stellenbosch', 'Durbanville', 'Bellville', 'Pretoria', 'Durban', 'East London'].map(a => (
                <li key={a}><a href={`https://thryv.co.za/areas-served/${a.toLowerCase().replace(' ', '-')}/`}>{a}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Thryv Accountants (Pty) Ltd. All rights reserved.</span>
          <span className="footer-copy">SAIPA · SAICA · Registered SARS Tax Practitioners</span>
        </div>
      </footer>
    </>
  )
}
