// lib/format.ts
export const formatVND = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('vi-VN');
};

export const formatPoints = (points: number | null | undefined): string => {
  if (points === null || points === undefined || isNaN(points)) {
    return '0';
  }
  return points.toLocaleString('vi-VN');
};
