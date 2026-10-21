export const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "430px",
  tablet: "768px",
  ipadLandscape: "1024px",
  desktop: "1200px",
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  ipadLandscape: `(max-width: ${size.ipadLandscape})`,
  desktop: `(min-width: ${size.desktop})`,

  // Handy aliases
  mobile: `(max-width: ${size.mobileL})`,
  tabletAndBelow: `(max-width: ${size.ipadLandscape})`,
  touch: `(hover: none) and (pointer: coarse)`,
};
