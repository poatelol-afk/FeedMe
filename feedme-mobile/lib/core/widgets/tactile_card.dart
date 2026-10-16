import 'package:flutter/material.dart';
import '../theme/feedme_theme.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tactile 3D Card Surface (Duolingo Style with solid border and inner depth)
/// Supports both backgroundColor and surfaceColor aliases for universal compatibility.
/// ═══════════════════════════════════════════════════════════════════════════════
class TactileCard extends StatelessWidget {
  final Widget child;
  final Color? backgroundColor;
  final Color? surfaceColor;
  final Color borderColor;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final double elevation;
  final VoidCallback? onTap;

  const TactileCard({
    super.key,
    required this.child,
    this.backgroundColor,
    this.surfaceColor,
    this.borderColor = FeedMeColors.cardBorder,
    this.padding = const EdgeInsets.all(16.0),
    this.borderRadius = 20.0,
    this.elevation = 4.0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveBackground = surfaceColor ?? backgroundColor ?? FeedMeColors.card;

    final container = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: effectiveBackground,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderColor, width: 2.0),
        boxShadow: elevation > 0
            ? [
                BoxShadow(
                  color: const Color(0x28000000),
                  offset: Offset(0, elevation),
                  blurRadius: elevation * 2,
                ),
              ]
            : null,
      ),
      child: child,
    );

    if (onTap == null) return container;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(borderRadius),
        onTap: onTap,
        child: container,
      ),
    );
  }
}
