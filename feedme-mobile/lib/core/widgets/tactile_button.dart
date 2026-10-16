import 'package:flutter/material.dart';
import '../theme/feedme_theme.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tactile 3D Action Button (Duolingo Style with 4px pressable bottom border)
/// ═══════════════════════════════════════════════════════════════════════════════
class TactileButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final Color color;
  final Color shadowColor;
  final Widget? icon;
  final double height;
  final TextStyle? textStyle;
  final bool isFullWidth;
  final double depth;

  const TactileButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.color = FeedMeColors.featherGreen,
    this.shadowColor = FeedMeColors.featherGreenShadow,
    this.icon,
    this.height = 48.0,
    this.textStyle,
    this.isFullWidth = true,
    this.depth = 4.0,
  });

  @override
  State<TactileButton> createState() => _TactileButtonState();
}

class _TactileButtonState extends State<TactileButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final effectiveDepth = _isPressed ? 0.0 : widget.depth;
    final topMargin = _isPressed ? widget.depth : 0.0;

    final content = AnimatedContainer(
      duration: const Duration(milliseconds: 60),
      margin: EdgeInsets.only(top: topMargin, bottom: widget.depth - effectiveDepth),
      height: widget.height,
      decoration: BoxDecoration(
        color: widget.color,
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: effectiveDepth > 0
            ? [
                BoxShadow(
                  color: widget.shadowColor,
                  offset: Offset(0, effectiveDepth),
                  blurRadius: 0,
                )
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16.0),
          onTapDown: widget.onPressed != null ? (_) => setState(() => _isPressed = true) : null,
          onTapUp: widget.onPressed != null ? (_) => setState(() => _isPressed = false) : null,
          onTapCancel: widget.onPressed != null ? () => setState(() => _isPressed = false) : null,
          onTap: widget.onPressed,
          child: Center(
            child: Row(
              mainAxisSize: widget.isFullWidth ? MainAxisSize.max : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.icon != null) ...[
                  widget.icon!,
                  const SizedBox(width: 8.0),
                ],
                Text(
                  widget.label,
                  style: widget.textStyle ??
                      const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.2,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    return widget.isFullWidth ? SizedBox(width: double.infinity, child: content) : content;
  }
}
