export function resizedCoordinates(
  clientX: number,
  clientY: number,
  position: string,
  coordinates: { xStart: number; yStart: number; xEnd: number; yEnd: number }
) {
  const { xStart, yStart, xEnd, yEnd } = coordinates;

  switch (position) {
    case "tl":
    case "start":
      return { xStart: clientX, yStart: clientY, xEnd, yEnd };
    case "tr":
      return { xStart, yStart: clientY, xEnd: clientX, yEnd };
    case "bl":
      return { xStart: clientX, yStart, xEnd, yEnd: clientY };
    case "br":
    case "end":
      return { xStart, yStart, xEnd: clientX, yEnd: clientY };
    default:
      return null;
  }
}
