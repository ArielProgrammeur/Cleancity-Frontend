import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, G, Text as SvgText } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface TrendChartProps {
  data: { month: string; count: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const max = Math.max(...data.map((d) => d.count));
  const barW = 10;
  const gap = 4;
  const chartW = data.length * (barW + gap) + 20;
  const chartH = 120;

  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Svg width={chartW} height={chartH}>
        <Line x1={0} y1={chartH - 10} x2={chartW} y2={chartH - 10} stroke="#1E2A4A" strokeWidth={1} />
        {data.map((d, i) => {
          const barH = (d.count / max) * (chartH - 20);
          const x = 10 + i * (barW + gap);
          const y = chartH - 10 - barH;
          return (
            <G key={d.month}>
              <Rect x={x} y={y} width={barW} height={barH} rx={3} fill="#10B981" opacity={0.75} />
              <Rect x={x} y={y} width={barW / 2} height={barH} rx={3} fill="#34D399" opacity={0.4} />
              <SvgText x={x + barW / 2} y={chartH - 2} fontSize={8} fill="#475569" textAnchor="middle">
                {d.month}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
