import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DonutChartProps {
  data: { status: string; count: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((a, b) => a + b.count, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = outerR * 0.58;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  }

  function describeArc(start: number, end: number) {
    if (end - start >= 360) {
      const mid = start + 180;
      const s1 = polarToCartesian(cx, cy, outerR, mid);
      const e1 = polarToCartesian(cx, cy, outerR, start);
      const s2 = polarToCartesian(cx, cy, outerR, end);
      const e2 = polarToCartesian(cx, cy, outerR, mid);
      const large1 = 0;
      return `M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 ${large1} 0 ${e1.x} ${e1.y} A ${outerR} ${outerR} 0 0 0 ${s2.x} ${s2.y} A ${outerR} ${outerR} 0 0 0 ${e2.x} ${e2.y}`;
    }
    const startP = polarToCartesian(cx, cy, innerR, end);
    const endP = polarToCartesian(cx, cy, innerR, start);
    const startOuter = polarToCartesian(cx, cy, outerR, start);
    const endOuter = polarToCartesian(cx, cy, outerR, end);
    const large = end - start > 180 ? 1 : 0;
    return [
      `M ${startP.x} ${startP.y}`,
      `L ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endP.x} ${endP.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${startP.x} ${startP.y}`,
      'Z',
    ].join(' ');
  }

  let cumulative = 0;
  const slices = data.map((d) => {
    const pct = d.count / total;
    const start = cumulative * 360;
    cumulative += pct;
    const end = cumulative * 360;
    return { ...d, start, end, pct };
  });

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((s) => (
            <Path key={s.status} d={describeArc(s.start, s.end)} fill={s.color} opacity={0.88} />
          ))}
        </G>
        <Circle cx={cx} cy={cy} r={innerR - 2} fill="#131A2E" />
        <Circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#1E2A4A" strokeWidth={0.5} opacity={0.3} />
      </Svg>
      <View style={styles.centerLabel}>
        <Text style={styles.centerValue}>{total}</Text>
        <Text style={styles.centerSub}>Total</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  centerLabel: { position: 'absolute', alignItems: 'center', gap: 2 },
  centerValue: { fontSize: 28, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },
  centerSub: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', letterSpacing: 0.5, textTransform: 'uppercase' },
});
