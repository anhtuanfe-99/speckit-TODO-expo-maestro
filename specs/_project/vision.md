# Project Vision: Speckit Todo Expo Maestro

**Created**: 2026-06-18
**Status**: Active

## Purpose

A lightweight, test-driven mobile task management app built with Expo (React Native) and validated end-to-end via Maestro. The project serves as a reference implementation of the Speckit SDD (Spec-Driven Development) workflow — where every acceptance criterion is directly executable as a Maestro flow.

## Target Users

- Individuals who need a simple, fast mobile task tracker
- Developers learning or evaluating the Speckit SDD methodology
- Anyone who prefers E2E-tested software with verifiable acceptance criteria

## Core Principles

1. **Spec-first**: Every feature starts with a specification, not code. Code is derived from specs.
2. **E2E-gated**: No feature is complete until its Maestro flows pass green.
3. **Minimal & focused**: Each feature does one thing well. Avoid scope creep.
4. **Mobile-native**: Built for touch interaction on iOS and Android via Expo.
5. **Testable by design**: Every user action has a corresponding testID and Maestro assertion.

## Success Metrics

- Zero regressions between releases (all flows green before merge)
- New features can be implemented in under 30 minutes from spec to green flows
- New contributors can understand the full feature scope by reading a single `spec.md`
