// Add your banner images to /src/assets/banners/ then import them below.
// Landscape: 1920x1080 | Portrait: 1079x1600
// The keys MUST exactly match your product `category` values in the database.

import cctvPortrait from "./banners/cctv-portrait.jpeg";
import acsLandscape from "/access-control-banners-banner.jpeg";
import acsPortrait from "./banners/acs-portrait.jpeg";
import singleAcsLandscape from "/single-access-control-banner.jpeg";
import singleAcsPortrait from "./banners/single-acs-portrait.jpeg";
import intercomLandscape from "/intercom-devices-banners.jpeg";
import intercomPortrait from "./banners/intercom-portrait.jpeg";
import curtainsLandscape from "/Curtains-banner.jpeg";
import curtainsPortrait from "./banners/curtains-portrait.jpeg";

export const categoryBanners = {
  "Security Cameras": {
    landscape: "/CCTV-Banner.jpeg",
    portrait: cctvPortrait,
  },
  "Access Control": {
    landscape: acsLandscape,
    portrait: acsPortrait,
  },
  "Single ACS Devices": {
    landscape: singleAcsLandscape,
    portrait: singleAcsPortrait,
  },
  "Video Intercom": {
    landscape: intercomLandscape,
    portrait: intercomPortrait,
  },
  Curtains: {
    landscape: curtainsLandscape,
    portrait: curtainsPortrait,
  },
  "Network Switches": {
    landscape: "/recorders-banner.jpg.jpeg",
    portrait: "/recorders-banner.jpg.jpeg",
  },
  "Software License": {
    landscape: "/cctv-security.png",
    portrait: "/cctv-security.png",
  },
  Kits: {
    landscape: "/single-access-control-banner.jpeg",
    portrait: "/single-access-control-banner.jpeg",
  },
  Accessories: {
    landscape: "/access-control-banners-banner.jpeg",
    portrait: "/access-control-banners-banner.jpeg",
  },
  "Luxury Bedsheets": {
    landscape: "/Lumina.jpg",
    portrait: "/Lumina.jpg",
  },
  Upholstery: {
    landscape: "/Terra.jpg",
    portrait: "/Terra.jpg",
  },
  Bedsheets: {
    landscape: "/Idyllic.jpg",
    portrait: "/Idyllic.jpg",
  },
};
