import axios from "axios";
import { ClipConfig, Gradient, GradientConfig } from "./interfaces";

export const getGradientConfig = ({
  gradient,
  width,
  height,
}: {
  gradient: Gradient;
  width: number;
  height: number;
}) => {
  // Specify angle in degrees
  const angleInDeg = gradient.angle;

  // Compute angle in radians - CSS starts from 180 degrees and goes clockwise
  // Math functions start from 0 and go anti-clockwise so we use 180 - angleInDeg to convert between the two
  const angle = ((180 - angleInDeg) / 180) * Math.PI;

  // This computes the length such that the start/stop points will be at the corners
  const length =
    Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));

  // Compute the actual x,y points based on the angle, length of the gradient line and the center of the div
  const halfx = Math.round((Math.sin(angle) * length) / 2.0);
  const halfy = Math.round((Math.cos(angle) * length) / 2.0);
  const cx = Math.round(width / 2.0);
  const cy = Math.round(height / 2.0);
  const x1 = cx - halfx;
  const y1 = cy - halfy;
  const x2 = cx + halfx;
  const y2 = cy + halfy;

  return {
    id: gradient.id,
    cssString: gradient.cssString,
    values: gradient.values,
    startIndex: { x: x1, y: y1 },
    endIndex: { x: x2, y: y2 },
  } as GradientConfig;
};

export const clipRect = (ctx: any, clipConfig: ClipConfig) => {
  const { x } = clipConfig;
  const { y } = clipConfig;
  const w = clipConfig.width;
  const h = clipConfig.height;
  const r = clipConfig.borderRadius || 0;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

export const getColorCodes = async (
  code: string,
  language: string,
) => {
  try {
    const {
      data: { success, data },
    } = await axios.post(
      'http://localhost:4000/color-codes',
      {
        code,
        language,
        theme: 'dark_plus',
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!success) throw Error("Failed to get color codes");
    return { data, success };
  } catch (e) {
    throw new Error(
      (e as any).response.message || (e as any).response.data.error
    );
  }
};